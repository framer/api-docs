// Processes the built site to wire up any @link tokens included in the TSDoc
// source code. It does this in two passes, the first to build up a page
// of paths -> api item id, the second to append an href to all @link tags
// the modified document is then written over the original file.
//
// For the other implementation points see the `LinkTag` geneation in
// TSDocReactEmitter.ts and the id resolution in the APIOverviewElement
// component.
//
// Usage:
//
//     % yarn ts-node ./linkify.ts <htmlfile> [, <htmlfile>...]
//     % yarn ts-node ./linkify.ts build/**/*.html
import * as fs from "fs"
import * as cheerio from "cheerio"
import chalk from "chalk"

const { yellow, gray, white } = chalk

const inputs = process.argv.slice(2)

const parsed = inputs.map(filepath => cheerio.load(fs.readFileSync(filepath).toString("utf-8")))
const pathById: { [id: string]: string } = {}

console.log("Updating TSDoc @link references")

parsed.forEach($ => {
    $("[data-permalink-ref][data-permalink-path]").each((_, el) => {
        const { permalinkRef, permalinkPath } = $(el).data()
        pathById[permalinkRef] = permalinkPath
    })
})

parsed.forEach(($, idx) => {
    const filepath = inputs[idx]
    let hasMatch = false

    $("[data-link-ref]").each((_, el) => {
        hasMatch = true

        const $el = $(el)
        const ref = $el.data("linkRef")
        if (pathById[ref]) {
            $el.attr("href", `${pathById[ref]}`)
        } else {
            $el.addClass("link-ref-missing")
            const id = $el.parents("[data-tsdoc-ref]").data("tsdocRef")
            console.warn(
                gray(
                    `${yellow("Warning:")} Could not resolve reference for: ${white(ref)} in ${white(
                        id || "Unknown"
                    )} on page ${white(filepath)}`
                )
            )
        }
    })

    if (hasMatch) {
        console.log(gray(`Writing new @link references → ${white(filepath)}`))
        fs.writeFileSync(filepath, $.html())
    }
})
