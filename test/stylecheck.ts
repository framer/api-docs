// Performs basic style checks on the code examples in the generated
// documentation.
// TODO: Run a syntax checker on the code.
//
// Usage:
//
//     % yarn ts-node ./styleCheck.ts <htmlfile> [, <htmlfile>...]
//     % yarn ts-node ./styleCheck.ts build/**/*.html
import * as fs from "fs"
import * as cheerio from "cheerio"
import chalk from "chalk"

const { yellow, gray, white } = chalk

const inputs = process.argv.slice(2)

const parsed = inputs.map(filepath => cheerio.load(fs.readFileSync(filepath).toString("utf-8")))

console.log("Checking example formatting")

const MatchStringProp = /(\w+)=("[^"]+")/

parsed.forEach(($, idx) => {
    const file = inputs[idx]

    $("[data-lang]").each((_, el) => {
        const code = $(el).text()
        const match = MatchStringProp.exec(code)
        if (match && match[1] !== "key") {
            const ref = $(el)
                .parents("[data-tsdoc-ref]")
                .data("tsdocRef")
            console.error(
                yellow(`WARN: ${white(file)} → ${ref}\n`),
                gray(
                    `Found string prop ${match[0]}, use interpolation instead for consistency: ${match[1]}={${
                        match[2]
                    }}`
                )
            )
        }
    })
})
