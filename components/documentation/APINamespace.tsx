import * as React from "react"
import { APIClassElement } from "./APIClass"
import { APIEnumElement } from "./APIEnum"
import { APIFunctionElement } from "./APIFunction"
import { APIInterfaceElement } from "./APIInterface"
import { APIMethodElement } from "./APIMethod"
import { APIOverviewElement } from "./APIOverview"
import { APIPropertyElement } from "./APIProperty"
import { APIVariableElement } from "./APIVariable"
import { FramerAPIContext } from "../contexts/FramerAPIContext"
import { DeprecatedNotice } from "./DeprecatedNotice"
import { Grid } from "../layout/Grid"
import { MissingModelWarning } from "./MissingModelWarning"
import { NamespaceModel, Kind } from "../../model"
import { Permalink } from "../layout/Permalink"
import { ReleaseBadge } from "./ReleaseBadge"
import { apiClassName, permalinkId } from "./helpers"
import { APIEntity, APIEntityExample } from "./types"

/**
 * Renders documentation for a TypeScript namespace. This is usually a
 * standalone object or extension of an exisiting object sharing the same name
 * within the module.
 *
 * Only renders the high level documentation for the namespace if available,
 * module members such as functions and variables should be provided as children.
 */
export const APINamespaceElement: React.FunctionComponent<APIEntityExample<NamespaceModel>> = props => {
    const children = React.Children.toArray(props.children)
    const members = children.filter(child => React.isValidElement(child) && child.type === NamespaceChildren)
    const rest = children.filter(child => !React.isValidElement(child) || child.type !== NamespaceChildren)

    // Most namespaces won't have any documentation so we just hide the header
    // and show their members instead.
    let header: JSX.Element | null = null
    if (props.summaryMarkup || props.deprecatedMarkup || rest.length) {
        header = (
            <Grid className={"grid-section-h2 " + apiClassName("namespace", props, rest)}>
                <h2>
                    <Permalink id={permalinkId(props)} name={props.name} modelId={props.id} skipnav={props.skipnav} />
                    {props.name || "Unknown Name"} <ReleaseBadge {...props} />
                </h2>
                <DeprecatedNotice {...props} />
                <APIOverviewElement {...props} />
                {rest}
            </Grid>
        )
    }
    return (
        <>
            {header}
            {members}
        </>
    )
}

/**
 * Renders documentation for an entire module (or Namespace in TypeScript terms)
 *
 * Will look up the Namespace by name or id.
 *
 * @param props.skipnav - If true will hide the item from the navigation
 */
export const APINamespace: React.FunctionComponent<APIEntity<NamespaceModel>> = props => {
    const { name, overrides, ...rest } = props
    const api = React.useContext(FramerAPIContext)
    const model = api.resolve(name, Kind.Namespace)
    if (!model) return <MissingModelWarning name={name} kind={Kind.Namespace} />

    return (
        <APINamespaceElement {...model} {...overrides} {...rest}>
            {props.children}
            <NamespaceChildren {...model} />
        </APINamespaceElement>
    )
}

const NamespaceChildren: React.FunctionComponent<NamespaceModel> = props => {
    return (
        <>
            {props.members.map(member => {
                switch (member.kind) {
                    case Kind.Class:
                        return <APIClassElement key={member.id} {...member} />
                    case Kind.Interface:
                        return <APIInterfaceElement key={member.id} {...member} />
                    case Kind.Method:
                    case Kind.MethodSignature:
                        return <APIMethodElement key={member.id} {...member} />
                    case Kind.Property:
                    case Kind.PropertySignature:
                        return <APIPropertyElement key={member.id} {...member} />
                    case Kind.Enum:
                        return <APIEnumElement key={member.id} {...member} />
                    case Kind.Function:
                        return <APIFunctionElement key={member.id} {...member} />
                    case Kind.TypeAlias:
                    case Kind.Variable:
                        return <APIVariableElement key={member.id} {...member} />
                    case Kind.ConstructSignature:
                    case Kind.Constructor:
                    case Kind.Namespace:
                    case Kind.EnumMember:
                    case Kind.Parameter:
                        throw new Error(`FramerNamespace received unexpeceted model of kind: ${member.kind}`)
                    default:
                        return assertNever(member)
                }
            })}
        </>
    )
}

function assertNever(x: never): never {
    throw new Error("Unexpected object: " + x)
}
