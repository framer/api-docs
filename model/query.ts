// Queries the framer.data.json file for specific entities. Useful for
// verifying which id to use for a specific API item when trying to fix
// broken references.
//
// Can be called either with a single command line argument or without
// arguments to start a repl.
//
// Usage:
// yarn ts-node ./model/query.ts '(animate:function)'
import * as readline from "readline"
import { FramerAPI } from "./FramerAPI"
import json from "../components/framer.data"

const api = new FramerAPI(json as any)
const query = process.argv[2]

const ids: string[] = []

type Item = { [id: string]: { children?: Item } }
;(function walk(tree: Item) {
    for (const [key, item] of Object.entries(tree)) {
        ids.push(key)
        if (item.children) {
            walk(item.children)
        }
    }
})(json)

if (query) {
    console.log(`Searching for ${query}:`)
    console.log(api.resolve(query))
} else {
    console.log("Starting query repl press <tab> to autocomplete & ctrl-c to exit:")

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: true,
        prompt: "query> ",
        completer: function completer(line: string) {
            const hits = ids.filter(id => id.startsWith(line))
            return [hits, line]
        },
    })
    rl.on("line", function(line) {
        console.log(api.resolve(line.trim()))
        rl.prompt()
    })
    rl.on("close", () => process.exit(0))
    rl.prompt()
}
