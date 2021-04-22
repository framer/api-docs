SHELL := /bin/bash

bin := $(shell yarn bin)
node := $(bin)/ts-node
watch := $(bin)/chokidar
monobase := $(bin)/monobase
dotenv := $(bin)/dotenv
cpy := $(bin)/cpy

BUILD_DIR ?= ./build
FRAMER_LIBRARY_DIR ?= ./node_modules/framer
FRAMER_MOTION_DIR ?= ./node_modules/framer-motion
FRAMER_LIBRARY_JSON := build/framer.api.json
FRAMER_MOTION_JSON := dist/framer-motion.api.json
GENERATOR_DEPENDENCIES := "$(FRAMER_LIBRARY_DIR)/$(FRAMER_LIBRARY_JSON)" "$(FRAMER_MOTION_DIR)/$(FRAMER_MOTION_JSON)"

.PHONY: usage
usage:
	@echo "Usage: make <command>"
	@echo "    bootstrap - installs project dependencies"
	@echo "    dev - runs a development server (alias: serve)"
	@echo "    build [BUILD_DIR=<path>] - generates a static site in the build directory"
	@echo "    verify-api-references [BUILD_DIR=<path>] - checks for missing API references in the HTML reports an error if found"
	@echo "    publish - generates a build for publishing to production"
	@echo "    publish-search - generates a build for publishing to production and indexes it"
	@echo "    search - indexes the current build directory"
	@echo "    upgrade - upgrades the monobase project to latest"
	@echo "    data [FRAMER_LIBRARY_DIR=<path>] [FRAMER_MOTION_DIR=<path>] - regenerates framer.data.json file"
	@echo "    data-update - updates framer & framer-motion to latest versions"
	@echo "    watch-lib [FRAMER_LIBRARY_DIR=<path>] - watches the FRAMER_LIBRARY_DIR for changes and rebuilds framer.data.js"
	@echo "    watch-motion [FRAMER_MOTION_DIR=<path>] - watches the FRAMER_MOTION_DIR for changes and rebuilds framer.data.js"
	@echo "    watch-all - watches the FRAMER_LIBRARY_DIR & FRAMER_MOTION_DIR for changes and rebuilds framer.data.js"
	@echo "    fixtures - regenerates the __fixtures__ files for unit tests"
	@echo "    query - run a query repl to inspect the framer.data.json file"
	@echo "    query QUERY=<ref> - lookup a specific id in the framer.data.json file"
	@echo ""
	@echo "    NOTE: You can use \`make -B\` to force rebuild changes if needed"

# Update node modules if package.json is newer than node_modules or yarn lockfile
node_modules/.yarn-integrity: yarn.lock package.json
	yarn install
	touch $@

.PHONY: bootstrap
bootstrap: node_modules/.yarn-integrity

.PHONY: test
test: bootstrap
	yarn jest

.PHONY: dev
dev: bootstrap data changelog
	@$(dotenv) -- $(monobase) serve --project=. --prefix=/api

.PHONY: serve
serve: dev

.PHONY: build
build: bootstrap data changelog
	@$(dotenv) -- $(monobase) build --project=. --path=$(BUILD_DIR)
	@find $(BUILD_DIR) -name '*.html' | xargs $(node) ./model/linkify.ts

.PHONY: verify-api-references
verify-api-references:
	@./test/verify-api-references build

.PHONY: publish
publish: bootstrap data changelog
	# Using /api for framer.com
	@$(dotenv) -- $(monobase) build --project=. --path=build --prefix=/api
	@$(node) ./model/linkify.ts build/api/**/*.html
	@$(cpy) '$(BUILD_DIR)/api/404.html' $(BUILD_DIR)

.PHONY: publish-search
publish-search:
	@make publish
	@make search

.PHONY: publish-env
publish-env:
ifeq ($(CONTEXT),"production")
	@make publish-search
else
	@make publish
endif

.PHONY: search
search:
	@$(dotenv) -- $(node) -O '{ "downlevelIteration": false }' ./model/searchify.ts

.PHONY: clean
clean:
	@rm -rf ./build

.PHONY: query
query-data: data
	@yarn ts-node ./model/query.ts '$(QUERY)'

.PHONY: upgrade
upgrade:
	@yarn add monobase@latest

.PHONY: fixtures
fixtures: api/__fixtures__/example.data.ts

.PHONY: data
data: components/framer.data.ts

.PHONY: data-update
data-update:
	@yarn add framer@latest
	@yarn add framer-motion@latest
	@make data

.PHONY: watch-lib
watch-lib:
	@test -d $(FRAMER_LIBRARY_DIR) || echo "Could not find Library source files at: FRAMER_LIBRARY_DIR=$(FRAMER_LIBRARY_DIR)"
	@SHELL=$(SHELL) $(watch) "$(FRAMER_LIBRARY_DIR)/src/**/*.ts" "$(FRAMER_LIBRARY_DIR)/src/**/*.tsx" -c "make -BC $(FRAMER_LIBRARY_DIR) $(FRAMER_LIBRARY_JSON) && make data; echo 'Updated framer.data.ts'"

.PHONY: watch-motion
watch-motion:
	@test -d $(FRAMER_MOTION_DIR) || echo "Could not find Library source files at: FRAMER_MOTION_DIR=$(FRAMER_MOTION_DIR)"
	@SHELL=$(SHELL) $(watch) "$(FRAMER_MOTION_DIR)/src/**/*.ts" "$(FRAMER_MOTION_DIR)/src/**/*.tsx" -c "make -BC $(FRAMER_MOTION_DIR) $(FRAMER_MOTION_JSON) && make data; echo 'Updated framer.data.ts'"

.PHONY: watch-all
watch-all: bootstrap
	# Set the shell to make it work in fish
	@SHELL=$(SHELL) $(watch) \
		"$(FRAMER_LIBRARY_DIR)/src/**/*.ts" \
		"$(FRAMER_LIBRARY_DIR)/src/**/*.tsx" \
		"$(FRAMER_MOTION_DIR)/src/**/*.ts" \
		"$(FRAMER_MOTION_DIR)/src/**/*.tsx" \
		-c "make -BC $(FRAMER_LIBRARY_DIR) $(FRAMER_LIBRARY_JSON) && make -BC $(FRAMER_MOTION_DIR) $(FRAMER_MOTION_JSON) && make data; echo 'Updated framer.data.ts...'"

# We put this in components dir so it'll be picked up by the monobase watcher
# The new framer.data.ts file is created in a temp file then swapped out to
# prevent the watcher from picking up the changes and erroring.
components/framer.data.ts: bootstrap $(wildcard api/*)
	@for dep in $(GENERATOR_DEPENDENCIES); do\
		if [[ ! -f "$$dep" ]]; then \
			echo "Could not find source file at: $$dep";\
			exit 1;\
		fi;\
	done
	@cat <(printf "export default ") <($(node) ./model/generator.ts $(GENERATOR_DEPENDENCIES)) > "$@.tmp"
	@mv -f "$@.tmp" "$@"

pages/changelog.mdx: bootstrap node_modules/framer/CHANGELOG.md
	@echo 'import { Changelog } from "../components/Changelog"' > "$@"
	@echo 'export default Changelog' >> "$@"
	@echo '' >> "$@"
	@cat node_modules/framer/CHANGELOG.md >> "$@"

.PHONY: changelog
changelog: pages/changelog.mdx

api/__fixtures__/example.data.ts: api/__fixtures__/example.api.json
	@cat <(printf "export default ") <($(node) ./model/generator.ts $<) > "$@"

.DEFAULT_GOAL := usage
