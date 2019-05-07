import * as React from "react"
import { InterfaceModel, Kind } from "../../api"
import { FramerAPIContext } from "../contexts/FramerAPIContext"
import { APIPropertyElement } from "./APIProperty"
import { APIMethodElement } from "./APIMethod"
import { APIOverviewElement } from "./APIOverview"
import { MissingModelWarning } from "./MissingModelWarning"
import { ReleaseBadge } from "./ReleaseBadge"
import { DeprecatedNotice } from "./DeprecatedNotice"
import { Grid } from "components/layout/Grid"
import { Permalink } from "../layout/Permalink"
import { apiClassName, permalinkId } from "./helpers"

/**
 * Renders the documentation for the InterfaceModel provided.
 *
 * Only renders the documentation specific to the interface. Methods and
 * properties should be provided as children.
 */
export const APIInterfaceElement: React.FunctionComponent<InterfaceModel & {skipnav?: boolean}> = props => {
    const children = React.Children.toArray(props.children)
    const methods = children.filter(child => React.isValidElement(child) && child.type === APIMethodElement)
    const properties = children.filter(child => React.isValidElement(child) && child.type === APIPropertyElement)

    const members = new Set(methods.concat(properties))
    const rest = children.filter(child => !members.has(child))

    return (
        <>
            <Grid className={"grid-section-h2 " + apiClassName("interface", props, rest)}>
                <h2>
                    <Permalink id={permalinkId(props)} name={props.name} modelId={props.id} skipnav={props.skipnav} />
                    {props.fullname || "Unknown Name"} <ReleaseBadge {...props} />
                </h2>
                <DeprecatedNotice {...props} />
                <APIOverviewElement {...props} />
                {rest}
            </Grid>
            {properties}
            {methods}
        </>
    )
}

/**
 * Renders documentation for the interface provided including any methods
 * and properties belonging to that interface. The component accepts any
 * additional InterfaceModel properties which will override those on the
 * retrieved model. This can be used to tweak the fullname etc.
 * @param props.name - The name of the interface.
 * @param props.overrides - Object containing properties from InterfaceModel to override.
 * @param props.skipnav - If true will hide the item from the navigation
 */
export const APIInterface: React.FunctionComponent<{ name: string; overrides?: Partial<InterfaceModel>; skipnav?: boolean }> = props => {
    const { name, overrides } = props
    const api = React.useContext(FramerAPIContext)
    const model = api.resolve(name, Kind.Interface)
    if (!model) return <MissingModelWarning name={props.name} kind={Kind.Interface} />

    const methods = model.methods.map(method => <APIMethodElement key={method.id} {...method} />)
    const properties = model.properties.map(property => <APIPropertyElement key={property.id} {...property} />)
    return (
        <APIInterfaceElement {...model} {...overrides} skipnav={props.skipnav}>
            {props.children}
            {properties}
            {methods}
        </APIInterfaceElement>
    )
}

/**
 * Renders the documentation for an interface merged with the
 * methods/properties from any additional interfaces provided via `extras`
 */
export const APIMergedInterface: React.FunctionComponent<{
    name: string
    extras?: string[]
    overrides?: Partial<InterfaceModel>
    skipnav?: boolean
}> = props => {
    const { extras = [], overrides } = props
    const api = React.useContext(FramerAPIContext)
    const model = api.resolve(props.name, Kind.Interface)
    if (!model) return <MissingModelWarning name={props.name} kind={Kind.Interface} />

    const extraModels = extras.map(id => api.resolve(id, Kind.Interface)).filter(Boolean) as InterfaceModel[]
    const members = [model, ...extraModels].reduce<JSX.Element[]>((members, model) => {
        const methods = model.methods.map(method => <APIMethodElement key={method.id} {...method} />)
        const properties = model.properties.map(property => <APIPropertyElement key={property.id} {...property} />)
        return [...members, ...methods, ...properties]
    }, [])

    return (
        <APIInterfaceElement {...model} {...overrides} skipnav={props.skipnav}>
            {props.children}
            {members}
        </APIInterfaceElement>
    )
}
