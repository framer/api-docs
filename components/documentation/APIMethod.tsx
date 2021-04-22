import * as React from "react"
import { MethodModel, Kind } from "../../model"
import { FramerAPIContext } from "../contexts/FramerAPIContext"
import { APIOverviewElement } from "./APIOverview"
import { MissingModelWarning } from "./MissingModelWarning"
import { ReleaseBadge } from "./ReleaseBadge"
import { DeprecatedNotice } from "./DeprecatedNotice"
import { Grid } from "components/layout/Grid"
import { Permalink } from "../layout/Permalink"
import { APIParam, APIParams } from "./APIParams"
import { Signature } from "./Signature"
import { apiClassName, permalinkId } from "./helpers"
import { APIEntityExample, APIEntity } from "./types"

/**
 * Renders the documentation for a single method.
 * @param props - The MethodModel to render
 */
export const APIMethodElement: React.FunctionComponent<APIEntityExample<MethodModel>> = props => {
    const signatures = [props].concat(props.overloads).map(method => (
        <h3 key={method.id}>
            <Permalink id={permalinkId(props)} name={props.name + "()"} modelId={props.id} skipnav />
            <Signature signature={method.signature} />
            <ReleaseBadge {...props} />
        </h3>
    ))
    const parameters = props.parameters.map(param => (
        <APIParam key={param.id} name={param.name} type={param.type}>
            <APIOverviewElement className="description" {...param} />
        </APIParam>
    ))
    if (props.returnType !== "void" || props.returnMarkup) {
        parameters.push(
            <APIParam key="return" name="returns" type={props.returnType}>
                <APIOverviewElement summaryMarkup={props.returnMarkup} />
            </APIParam>
        )
    }

    return (
        <Grid className={apiClassName("method", props, React.Children.toArray(props.children))}>
            {signatures}
            <DeprecatedNotice {...props} />
            <APIOverviewElement {...props} />
            {props.children}
            {parameters.length ? <APIParams>{parameters}</APIParams> : null}
        </Grid>
    )
}

/**
 * Displays API information about a particular method. As methods can
 * have multiple signatures an optional `overrideIndex` prop can be used
 * to display a specific one. Otherwise the first function will be used.
 * @param props.name - The name of the method to display.
 * @param props.overrides - An optional object of properties in MethodModel to override.
 */
export const APIMethod: React.FunctionComponent<APIEntity<MethodModel>> = props => {
    const { name, overrides, ...rest } = props
    const api = React.useContext(FramerAPIContext)

    const model = api.resolve(name, Kind.Method)
    if (!model) return <MissingModelWarning name={name} kind={Kind.Method} />

    return (
        <APIMethodElement {...model} {...overrides} {...rest}>
            {props.children}
        </APIMethodElement>
    )
}
