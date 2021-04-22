/**
 * Subset of types found in @microsoft/api-extractor-model
 */
export enum Kind {
    Class = "Class",
    Constructor = "Constructor",
    ConstructSignature = "ConstructSignature",
    Enum = "Enum",
    EnumMember = "EnumMember",
    Function = "Function",
    Interface = "Interface",
    Method = "Method",
    MethodSignature = "MethodSignature",
    Namespace = "Namespace",
    Parameter = "Parameter",
    Property = "Property",
    PropertySignature = "PropertySignature",
    TypeAlias = "TypeAlias",
    Variable = "Variable",
}

export interface ModelByKind {
    [Kind.Class]: ClassModel
    [Kind.Constructor]: MethodModel
    [Kind.ConstructSignature]: MethodModel
    [Kind.Enum]: EnumModel
    [Kind.EnumMember]: PropertyModel
    [Kind.Function]: MethodModel
    [Kind.Interface]: InterfaceModel
    [Kind.Method]: MethodModel
    [Kind.MethodSignature]: MethodModel
    [Kind.Namespace]: NamespaceModel
    [Kind.Parameter]: ParameterModel
    [Kind.Property]: PropertyModel
    [Kind.PropertySignature]: PropertyModel
    [Kind.TypeAlias]: PropertyModel
    [Kind.Variable]: PropertyModel
    [kind: string]: AnyModel
}

export enum ReleaseTag {
    None = "none",
    Internal = "internal",
    Alpha = "alpha",
    Beta = "beta",
    Public = "public",
}

export interface BaseModel {
    id: string
    parentId: string | null
    name: string
    fullname: string
    kind: Kind
    releaseTag: ReleaseTag
    tsdoc: string | null
    signature: string | null
    summaryMarkup: string | null
    remarksMarkup: string | null
    prototypeMarkup: string | null
    productionMarkup: string | null
    deprecatedMarkup: string | null
    visibility: "public" | "beta" | "alpha" | "internal" | "none"
}
export type RawBaseModel = BaseModel

/**
 * TypeScript namespace (should map to 1:1 with modules/files)
 * see: https://www.typescriptlang.org/docs/handbook/namespaces.html
 */
export interface NamespaceModel extends BaseModel {
    kind: Kind.Namespace
    members: AnyModel[]
}
export interface RawNamespaceModel extends BaseModel {
    kind: Kind.Namespace
    members: string[]
}

export interface ClassModel extends BaseModel {
    kind: Kind.Class
    constructor: MethodModel | null
    properties: PropertyModel[]
    methods: MethodModel[]
}
export interface RawClassModel extends BaseModel {
    kind: Kind.Class
    constructor: string | null
    properties: string[]
    methods: string[]
}

export interface InterfaceModel extends BaseModel {
    kind: Kind.Interface
    constructor: MethodModel | null
    properties: PropertyModel[]
    methods: MethodModel[]
}
export interface RawInterfaceModel extends BaseModel {
    kind: Kind.Interface
    constructor: string | null
    properties: string[]
    methods: string[]
}

// TODO: Rename to FunctionLike?
export interface MethodModel extends BaseModel {
    kind: Kind.Method | Kind.MethodSignature | Kind.Function | Kind.ConstructSignature | Kind.Constructor
    isStatic: boolean
    returnType: string
    returnMarkup: string | null
    releaseTag: ReleaseTag
    overloadIndex: number
    overloads: MethodModel[]
    parameters: ParameterModel[]
}
export interface RawMethodModel extends BaseModel {
    kind: Kind.Method | Kind.MethodSignature | Kind.Function | Kind.ConstructSignature | Kind.Constructor
    isStatic: boolean
    returnType: string
    returnMarkup: string | null
    releaseTag: ReleaseTag
    overloadIndex: number
    overloads: string[]
    parameters: string[]
}

export interface EnumModel extends BaseModel {
    kind: Kind.Enum
    fields: PropertyModel[]
}
export interface RawEnumModel extends BaseModel {
    kind: Kind.Enum
    fields: string[]
}

export interface PropertyModel extends BaseModel {
    kind: Kind.Property | Kind.PropertySignature | Kind.EnumMember | Kind.TypeAlias | Kind.Variable
    type: string
}
export type RawPropertyModel = PropertyModel
export interface ParameterModel extends BaseModel {
    kind: Kind.Parameter
    type: string
}
export type RawParameterModel = ParameterModel

export type AnyModel =
    | NamespaceModel
    | ClassModel
    | InterfaceModel
    | EnumModel
    | MethodModel
    | PropertyModel
    | ParameterModel
export type AnyRawModel =
    | RawNamespaceModel
    | RawClassModel
    | RawInterfaceModel
    | RawEnumModel
    | RawMethodModel
    | RawPropertyModel
    | RawParameterModel

export interface RawAPIData {
    [key: string]: { model: AnyRawModel; children: RawAPIData }
}
