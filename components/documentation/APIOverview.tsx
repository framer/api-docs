import * as React from "react"
import { usePath } from "monobase"
import { FramerAPIContext } from "../contexts/FramerAPIContext"

/**
 * Renders the TSDoc documentation for a particular object. Will include both
 * the `@summary` and `@remarks` sections if available.
 */
export const APIOverviewElement: React.FunctionComponent<{
    id?: string
    summaryMarkup?: string | null
    remarksMarkup?: string | null
    prototypeMarkup?: string | null
    productionMarkup?: string | null
    fallback?: React.ReactNode
    className?: string
}> = props => {
    const env = usePath().search("/production/") !== -1 ? "production" : "prototype"
    const api = React.useContext(FramerAPIContext)
    let markup = props.summaryMarkup || ""
    console.log(
        "summary",
        props.summaryMarkup,
        "remarks",
        props.remarksMarkup,
        "prototype",
        props.prototypeMarkup,
        "production",
        props.productionMarkup
    )
    if (props.remarksMarkup) {
        markup += props.remarksMarkup
    }

    if (env === "prototype" && props.prototypeMarkup) {
        markup += props.prototypeMarkup
    } else if (env === "production" && props.productionMarkup) {
        markup += props.productionMarkup
    }

    // Hackily resolve any inline references in the markup:
    markup = markup.replace(LinkRefRegex, (match, id: string) => {
        const model = api.resolve(id)
        return match.replace(id, model ? model.id : id)
    })

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
export const APIOverview: React.FunctionComponent<{ name: string }> = ({ name }) => {
    const api = React.useContext(FramerAPIContext)
    return <APIOverviewElement {...api.resolve(name)} />
}

/**
 * Matches a data-link-ref data attribute in HTML markup and captures it's
 * value. Used for find/replace of @link tokens.
 */
const LinkRefRegex = /data-link-ref="([^"]+)"/g
