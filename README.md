<h1 align="center">
    <img src="https://static.framer.com/repos/logo-dark.png" width="40"/>
    <br>
    API Docs
</h1>

The official [Framer Library][#framer-library] & [Framer Motion](#framer-motion) documentation. It’s
a curated site that can pull in documentation from the [TSDoc][#tsdoc] comments in the project source.
The foundation of the site is built on top of [Monobase][#monobase]. You can see the published
website at [framer.com/api/][#website]

[#framer-library]: https://www.npmjs.com/package/framer
[#framer-motion]: https://www.framer.com/motion/
[#tsdoc]: https://github.com/Microsoft/tsdoc
[#monobase]: https://github.com/koenbok/monobase/
[#website]: https://framer.com/api/

<img src="https://static.framer.com/repos/api.png" />

## Contributing

If you're interested in contributing documentation check [Contributing](./CONTRIBUTING.md) for
more details on adding and updating content. For hacking on the api-docs project itself
read on.

## Installation

Clone the repository and install the dependencies:

    % git clone git@github.com:framer/api-docs.git
    % cd api-docs
    % make bootstrap

## Structure

```
.
├── Makefile            # Build Scripts
├── api                 # All files releated to generating framer.data.ts
├── components          # Holds all React components
│   ├── Navigation.tsx  # The main site navigation
│   ├── Template.tsx    # The main site template
│   ├── contexts        # React contexts
│   ├── documentation   # Components for displaying documentation from source code
│   ├── bootstrap.ts    # Contains JavaScript to be run on page load, e.g. syntax highlighting.
│   ├── framer.data.ts  # JSON data backing the documentation components
│   ├── index.tsx       # Exports components for use in pages
│   └── layout          # Components related to the site layout
├── pages               # Holds mdx & tsc files representing the page structure of the site
├── static              # Contains any static assets such as images.
```

## Development

A development server can be started by running:

    % make serve

This will watch for changes to the project files and reload the page when modified.

## Testing

We use [jest][#jest] for our unit tests, these are mostly focused around the code
used to generate the framer.data.ts file in the [model](/model) directory. Though test
for other parts of the codebase are most welcome.

To run the test suite:

    % yarn jest

This will also be run by CircleCI on each commit and open Pull Request. CircleCI will
also make a rudimentary check for missing models referenced by the API docs. The build
output will contain logs with the broken reference ids.

[#jest]: https://jestjs.io

## Submitting Changes

Push changes up to a new branch in a fork of the api-docs repository (core team members can
push directly to this repository) and open a Pull Request describing the changes.

## Deployment

Deployment is managed by [Vercel][#vercel]. On each commit to the master branch Vercel
will rebuild changes and publish. Vercel will also generate a build for any pull requests
created and add a link via the comments. The [vercel.json](./vercel.json) file contains
the routing configuration for Vercel.

To invoke a manual build you can run:

    % make build

This will output the static HTML/CSS and JavaScript into a build directory in the project root.

[#vercel]: https://vercel.com/

## Framer API Data

The project makes use of the **framer.api.json** file bundled with each release of the "framer"
and "framer-motion" packages. Both of these packages are installed as dependencies and we currently
always track the latest release.

in the FramerStudio repository from this we extract the useful information used by our Framer API
components. This is then transformed into a **framer.data.ts** package that is used by the
`<FramerAPIContext>` component.

A `FramerAPI` class is available that provides lookup methods for querying the TypeScript API.

Example:

```tsx
const scrollComponent = api.queryClass("Scroll")
console.log(scrollComponent.name)
console.log(scrollComponent.methods)
console.log(scrollComponent.properties)
```

The interfaces for these objects are defined in **api/types.ts**.

To regenerate the JSON data run:

    % make data

If the API docs become out of date run:

    % make data-update

By default `make data` will use the "framer" and "framer-motion" packages installed under
node_modules. To reference a different install of either of these packages you can provide
paths to make:

    % make data FRAMER_LIBRARY_DIR=../some/path/to/Library FRAMER_MOTION_DIR=../some/path/to/motion

## Upgrading

To add support for custom `@library` and `@motion` block types, we use the undocumented process of monkey-patching the `AedocDefinitions` class within `api-extractor-model`. This is then consumed by `api-extractor`.

Ensure that when updating `@microsoft/tsdocs`, `@microsoft/api-extractor-model` and/or `@microsoft/api-extractor` that all three packages are the latest version and that none of them install extra versions of the others to solve a minor version discrepancy. Otherwise the monkey-patch might be applied to an un-used version of `AedocDefinitions`.

## Query Dataset

Sometimes the build will error with broken references and you'll need to find
the correct one to use. There is a `query-data` make command that allows
you to lookup TSDoc ids in the dataset:

    % make query-data QUERY='(animate:namespace)'

Or when run without arguments it will start a repl:

    % make query-data
    query> (animate:namespace)
    { ... big blob of json ... }
    query>

Press `ctrl-c` at any time to exit the repl.
