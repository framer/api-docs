import className from "classnames"
import { AnyModel, BaseModel } from "../../model"

/* Returns true if the model has no content */
export function isHeaderEmpty(model: AnyModel, children: any[] = []): boolean {
    return (
        !model.summaryMarkup &&
        !model.deprecatedMarkup &&
        !model.prototypeMarkup &&
        !model.productionMarkup &&
        children.length === 0
    )
}

export function apiClassName(type: string, model: AnyModel, children: any[] = []): string {
    return className("framer-api", `framer-${type}`, { "framer-api-empty": isHeaderEmpty(model, children) })
}

export function permalinkId(model: BaseModel) {
    // Remove all non-alphanumeric characters except periods.
    return model.fullname.replace(/\W/g, match => (match === "." ? match : "")).toLowerCase()
}
