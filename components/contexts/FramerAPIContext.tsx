import * as React from "react"
import { FramerAPI } from "../../model"

import json from "../framer.data"

const api = new FramerAPI(json as any)

export const FramerAPIContext: React.Context<FramerAPI> = React.createContext(api)

export const FramerAPIDefaultProvider: React.FunctionComponent = props => {
    return <FramerAPIContext.Provider value={api}>{props.children}</FramerAPIContext.Provider>
}
