import escape from "lodash.escape"
import * as React from "react"
import { FramerAPIContext } from "../contexts/FramerAPIContext"
import { isMotion } from "../utils/env"

export type WithHighlight = { highlight?: string }

/**
 * Renders the TSDoc documentation for a particular object. Will include both
 * the `@summary` and `@remarks` sections if available. A `highlight` prop
 * can be provided to highlight lines in each code snippet, this will target
 * the first line, or an array can be passed to highlight multiple blocks.
 *
 * ```
 * // highlight lines one to four in the first block
 * <APIOverviewElement remarksMarkup={...} highlight="1-4" />
 *
 * // highlight lines 1 to 4 in the first block, and 8 & 11 in the third.
 * <APIOverviewElement remarksMarkup={...} highlight={["1-4", "", "8,11"]} />
 * ```
 */
export const APIOverviewElement: React.FunctionComponent<{
    id?: string
    summaryMarkup?: string | null
    remarksMarkup?: string | null
    prototypeMarkup?: string | null
    productionMarkup?: string | null
    className?: string
    highlight?: string | string[]
}> = props => {
    const isProd = isMotion()
    const api = React.useContext(FramerAPIContext)
    let markup = props.summaryMarkup || ""

    if (props.remarksMarkup) {
        markup += props.remarksMarkup
    }

    if (!isProd && props.prototypeMarkup) {
        markup += props.prototypeMarkup
    } else if (isProd && props.productionMarkup) {
        markup += props.productionMarkup
    }

    // Hackily resolve any inline references in the markup:
    markup = markup.replace(LinkRefRegex, (match, id: string) => {
        const model = api.resolve(id)
        return match.replace(id, model ? escape(model.id) : id)
    })

    // Insert highlight string if provided:
    if (props.highlight) {
        markup = insertHighlight(markup, props.highlight)
    }

    return (
        <div
            className={`grid--exclude ${props.className || ""}`}
            dangerouslySetInnerHTML={{ __html: markup }}
            data-tsdoc-ref={props.id}
        />
    )
}

/**
 * Renders the TSDoc documentation for a particular object. Will include both
 * the `@summary` and `@remarks` sections if available.
 * @param props.name - The name of the API entity.
 */
export const APIOverview: React.FunctionComponent<{ name: string; highlight: string | string[] }> = ({
    name,
    highlight,
}) => {
    const api = React.useContext(FramerAPIContext)
    return <APIOverviewElement {...api.resolve(name)} highlight={highlight} />
}

/**
 * Matches a data-link-ref data attribute in HTML markup and captures its
 * value. Used for find/replace of @link tokens.
 */
const LinkRefRegex = /data-link-ref="([^"]+)"/g

/**
 * Inserts a metastring="highlight()" attribute into codeblocks or do nothing
 * if no range was found for the codeblock.
 */
function insertHighlight(html: string, value: string | string[]): string {
    let index = 0
    const values = Array.isArray(value) ? value : [value]
    return html.replace(/data-lang=/gi, match => {
        const range = values[index++] || null
        return range ? `highlight="${escape(range)})" ${match}` : match
    })
}

