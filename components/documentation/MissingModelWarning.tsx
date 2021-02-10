import * as React from "react"
import { Kind } from "../../model"

/**
 * Helper for displaying a warning message when unable to render an API
 * component only by name.
 */
export const MissingModelWarning: React.FunctionComponent<{ name: string; kind?: Kind }> = ({ name, kind }) => {
    return (
        <div data-missing-model={`${kind} → ${name}`}>
            <h3>
                <span style={{ color: "red", fontWeight: 500 }}>{name}</span>
                <span style={{ opacity: 0.5 }}> missing</span>
            </h3>
        </div>
    )
}
