import * as Prism from "prismjs"
import "prismjs/components/prism-javascript"
import "prismjs/components/prism-jsx"
import "prismjs/components/prism-tsx"
import "prismjs/components/prism-typescript"

const isNumber = (num: number) => !Number.isNaN(num)

Prism.hooks.add("before-insert", env => {
    const el = env.element
    const source = env.highlightedCode
    if (!source || !el || el.classList.contains("highlight-line")) return

    const highlight = el.getAttribute("highlight")
    if (!highlight) return

    // If the fenced code block has a metastring attribute then the highlight
    // prop likely contained spaces and may be malformed.
    const metastring = el.getAttribute("metastring") || ""
    if (metastring.length > 0) {
        console.warn(
            `Found "metastring" attribute "${metastring}" on a code block, ensure there are no spaces in your highlight block: "${highlight}"`
        )
    }

    // Format is 1-3,6-8
    const ranges = highlight.split(",").map(range => {
        const parsed = range
            .trim()
            .split("-")
            .map(Number)
            .filter(isNumber)

        const min = Math.max(Math.min(...parsed), 1)
        const max = Math.max(...parsed)

        // Zero-index the range.
        return [min - 1, max - 1]
    })

    el.classList.add("has-highlight-line")
    env.highlightedCode = env.highlightedCode
        .split("\n")
        .map((line: string, idx: number) => {
            const isHighlighted = ranges.some(([start, end]) => idx >= start && idx <= end)
            // Wrapping lines based on newline entries has the potential to
            // break the existing dom structure i.e if a token spans multiple
            // lines. We use a custom element here so we don't close the
            // existing prism spans and let the browser do its best to
            // re-construct the document.
            return `<prism-line class="line${isHighlighted ? " highlight-line" : ""}">${line}</prism-line>`
        })
        .join("\n")
})

export function highlight() {
    Array.from(document.querySelectorAll<HTMLElement>('[class*="language-"]')).forEach(el => {
        const language = Array.from(el.classList).find(className => className.indexOf("language-") === 0)
        // Upgrade any "typescript" to "tsx"
        if (language === "language-typescript" || language === "language-javascript") {
            const replacement = language === "language-typescript" ? "language-tsx" : "language-jsx"
            el.classList.remove(language)
            el.classList.add(replacement, `original-${language}`)
        }

        Prism.highlightElement(el)
    })
}
