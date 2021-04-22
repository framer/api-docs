import * as React from "react"
import { Kind, BaseModel, EnumModel } from "../../model"
import { FramerAPIContext } from "../contexts/FramerAPIContext"
import { APIOverviewElement } from "./APIOverview"
import { MissingModelWarning } from "./MissingModelWarning"
import { ReleaseBadge } from "./ReleaseBadge"
import { DeprecatedNotice } from "./DeprecatedNotice"
import { Grid } from "components/layout/Grid"
import { Permalink } from "../layout/Permalink"
import { apiClassName, permalinkId } from "./helpers"
import { APIEntityExample, APIEntity } from "./types"

/**
 * Renders the documentation for the enum provided including the individual
 * fields.
 * @param props - An EnumModel object.
 */
export const APIEnumElement: React.FunctionComponent<APIEntityExample<EnumModel>> = props => {
    return (
        <>
            <Grid className={"grid-section-h2 " + apiClassName("enum", props)}>
                <h2>
                    <Permalink
                        id={permalinkId(props)}
                        name={props.fullname}
                        modelId={props.id}
                        skipnav={props.skipnav}
                    />
                    {props.fullname || "Unknown Name"} <ReleaseBadge {...props} />
                </h2>
                <DeprecatedNotice {...props} />
                <APIOverviewElement {...props} />
                {props.children}
            </Grid>
            {props.fields.map(field => (
                <APIEnumFieldElement key={field.id} {...field} />
            ))}
        </>
    )
}

export const APIEnumFieldElement: React.FunctionComponent<BaseModel> = props => {
    return (
        <Grid className="framer-enum-field framer-api">
            <h3>
                <Permalink id={permalinkId(props)} name={props.fullname} modelId={props.id} skipnav />
                {props.fullname}
            </h3>
            <APIOverviewElement {...props} />
            {props.children}
        </Grid>
    )
}

/**
 * Displays the documentation for an enum, properties of the EnumModel can be
 * overriden by providing the `overrides` prop.
 * @param props.name - The name of the enum.
 * @param props.overrides - Any members of the EnumModel to override
 * @param props.skipnav - If true hides the item from the navigation
 */
export const APIEnum: React.FunctionComponent<APIEntity<EnumModel>> = props => {
    const { name, overrides, ...rest } = props
    const api = React.useContext(FramerAPIContext)
    const model = api.resolve(name, Kind.Enum)
    if (!model) return <MissingModelWarning name={name} kind={Kind.Enum} />

    return (
        <APIEnumElement {...model} {...overrides} {...rest}>
            {props.children}
        </APIEnumElement>
    )
}

export const APIEnumField: React.FunctionComponent<{ name: string; overrides?: Partial<BaseModel> }> = props => {
    const { name, overrides, ...rest } = props
    const api = React.useContext(FramerAPIContext)
    const model = api.resolve(name)
    if (!model) return <MissingModelWarning name={name} kind={Kind.EnumMember} />

    return (
        <APIEnumFieldElement {...model} {...overrides} {...rest}>
            {props.children}
        </APIEnumFieldElement>
    )
}
