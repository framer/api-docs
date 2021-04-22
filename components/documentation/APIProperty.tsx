import * as React from "react"
import { Kind, PropertyModel } from "../../model"
import { FramerAPIContext } from "../contexts/FramerAPIContext"
import { APIOverviewElement } from "./APIOverview"
import { MissingModelWarning } from "./MissingModelWarning"
import { ReleaseBadge } from "./ReleaseBadge"
import { DeprecatedNotice } from "./DeprecatedNotice"
import { Grid } from "components/layout/Grid"
import { Permalink } from "../layout/Permalink"
import { Signature } from "./Signature"
import { apiClassName, permalinkId } from "./helpers"
import { APIEntity, APIEntityExample } from "./types"

export const APIPropertyElement: React.FunctionComponent<APIEntityExample<PropertyModel>> = props => {
    return (
        <Grid className={apiClassName("property", props, React.Children.toArray(props.children))}>
            <h3>
                <Permalink id={permalinkId(props)} name={props.name} modelId={props.id} skipnav />
                <Signature signature={props.signature} />
                <ReleaseBadge {...props} />
            </h3>
            <DeprecatedNotice {...props} />
            <APIOverviewElement {...props} />
            {props.children}
        </Grid>
    )
}

/**
 * Displays the documentation for a single class or interface property. Fields on the
 * PropertyModel can be overridden by providing the overrides prop.
 * @param props.name The name of the property including classname and namespaces.
 * @param props.overrides An object containing PropertyModel properties to override
 */
export const APIProperty: React.FunctionComponent<APIEntity<PropertyModel>> = props => {
    const { name, overrides, ...rest } = props
    const api = React.useContext(FramerAPIContext)

    const model = api.resolve(name, Kind.Property)
    if (!model) return <MissingModelWarning name={name} kind={Kind.Property} />

    return (
        <APIPropertyElement {...model} {...overrides} {...rest}>
            {props.children}
        </APIPropertyElement>
    )
}
