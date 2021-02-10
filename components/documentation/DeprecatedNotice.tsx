import * as React from "react"
import { AnyModel } from "../../model"
import { APIOverviewElement } from "./APIOverview"

/**
 * Renders a badge if the method is depreacted.
 * @param props.isDeprecated - True if a badge should be displayed.
 */
export const DeprecatedNotice: React.FunctionComponent<{ id?: string; deprecatedMarkup: string | null }> = props => {
    if (!props.deprecatedMarkup) return null
    return <APIOverviewElement className="deprecated-notice" id={props.id} summaryMarkup={props.deprecatedMarkup} />
}

/** Returns true if the model is deprecated */
export function isDeprecated(props: AnyModel): boolean {
    return Boolean(props.deprecatedMarkup)
}
