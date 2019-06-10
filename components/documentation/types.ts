import { WithSkipNav } from "../layout/Permalink"
import { WithHighlight } from "./APIOverview"

export type APIEntity<Model> = { name: string; overrides?: Partial<Model> } & WithSkipNav & WithHighlight

export type APIEntityExample<Model> = Model & WithSkipNav & WithHighlight
