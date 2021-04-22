import * as React from "react"
import { ClassModel, Kind } from "../../model"
import { FramerAPIContext } from "../contexts/FramerAPIContext"
import { APIPropertyElement } from "./APIProperty"
import { APIMethodElement } from "./APIMethod"
import { APIOverviewElement } from "./APIOverview"
import { MissingModelWarning } from "./MissingModelWarning"
import { ReleaseBadge } from "./ReleaseBadge"
import { DeprecatedNotice } from "./DeprecatedNotice"
import { Grid } from "../layout/Grid"
import { Permalink } from "../layout/Permalink"
import { apiClassName, permalinkId } from "./helpers"

/**
 * Renders the documentation for the class model provided.
 *
 * Only renders the documentation specific to the class. Methods and properties should be provided as children.
 * Any children that are not methods or properties will be included after the description.
 */
export const APIClassElement: React.FunctionComponent<ClassModel & { skipnav?: boolean }> = props => {
    const children = React.Children.toArray(props.children)
    const methods = children.filter(child => React.isValidElement(child) && child.type === APIMethodElement)
    const properties = children.filter(child => React.isValidElement(child) && child.type === APIPropertyElement)

    const members = new Set(methods.concat(properties))
    const rest = children.filter(child => !members.has(child))

    return (
        <>
            <Grid className={"grid-section-h2 " + apiClassName("class", props, rest)}>
                <h2>
                    <Permalink
                        id={permalinkId(props)}
                        name={props.name + "()"}
                        modelId={props.id}
                        skipnav={props.skipnav}
                    />
                    {props.fullname || "Unknown Name"} <ReleaseBadge {...props} />
                </h2>
                <DeprecatedNotice {...props} />
                <APIOverviewElement {...props} />
                {rest}
            </Grid>
            {props.constructor ? <APIMethodElement {...props.constructor} /> : null}
            {properties}
            {methods}
        </>
    )
}

/**
 * Displays documentation for a TypeScript class. Properties of the ClassModel can
 * be overridden using the `overrides` property if needed.
 * @param props.name - The name of the class.
 * @param props.overrides - Any members of the ClassModel to override
 * @param props.skipnav - If true hides the entry from the navigation
 */
export const APIClass: React.FunctionComponent<{
    name: string
    overrides?: Partial<ClassModel>
    skipnav?: boolean
}> = props => {
    const { name, overrides } = props
    const api = React.useContext(FramerAPIContext)
    const model = api.resolve(name, Kind.Class)
    if (!model) return <MissingModelWarning name={name} kind={Kind.Class} />

    const methods = model.methods.map(method => <APIMethodElement key={method.id} {...method} />)
    const properties = model.properties.map(property => <APIPropertyElement key={property.id} {...property} />)
    return (
        <APIClassElement {...model} {...overrides} skipnav={props.skipnav}>
            {props.children}
            {properties}
            {methods}
        </APIClassElement>
    )
}
