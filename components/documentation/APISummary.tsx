import * as React from "react"
import { FramerAPIContext } from "components/contexts/FramerAPIContext"
import { APIOverviewElement } from "./APIOverview"
import { MissingModelWarning } from "./MissingModelWarning"
/**
 * Renders the TSDoc summary provided. `summaryMarkup` is just static HTML. To
 * display the full documentation use the `<APIOverviewElement>`.
 */
export const APISummaryElement: React.FunctionComponent<{
    summaryMarkup: string | null | undefined
}> = props => {
    if (!props.summaryMarkup) return null
    return <APIOverviewElement {...props} />
}

/**
 * Renders the TSDoc summary for a particular object.
 */
export const APISummary: React.FunctionComponent<{ name: string }> = ({ name }) => {
    const api = React.useContext(FramerAPIContext)
    const model = api.resolve(name)
    if (!model) return <MissingModelWarning name={name} />
    return <APISummaryElement {...model} />
}
