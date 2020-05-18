import {
    RawAPIData,
    AnyModel,
    AnyRawModel,
    Kind,
    RawClassModel,
    RawInterfaceModel,
    RawMethodModel,
    RawEnumModel,
    RawNamespaceModel,
    ClassModel,
    InterfaceModel,
    MethodModel,
    EnumModel,
    NamespaceModel,
    ModelByKind,
} from "./types"

/**
 * Wraps the Framer JSON data and provides methods for accessing the models.
 */
export class FramerAPI {
    constructor(private data: RawAPIData) {}

    /** Look up a model directly by id and return an object with all relationships populated */
    get<T extends AnyModel>(id: string | undefined): T | null {
        if (!id) return null

        const json = (() => {
            const keys = id.toLowerCase().split(".")
            let current = this.data

            while (keys.length) {
                let key = keys.shift()
                if (!key) return null

                // Legacy support for (foo:function) ids that were
                // migrated to (foo:1) in more recent api-extractor
                // versions.
                if (!current[key] && key.endsWith(":function)")) {
                    key = key.replace(":function)", ":1)")
                }
                if (!current[key] && key.endsWith(":instance)")) {
                    key = key.replace(":instance)", ":instance,1)")
                }

                if (!current[key]) return null

                if (keys.length === 0) {
                    return current[key].model
                } else {
                    current = current[key].children
                }
            }

            return null
        })()

        return json ? (this.process(json) as T) : null
    }

    /**
     * Returns all top level models that do not have a parent class or interface.
     */
    rootModels(): ReadonlyArray<AnyModel> {
        return Object.keys(this.data)
            .map(this.get, this)
            .filter(Boolean) as AnyModel[]
    }

    /**
     * Resolves a TSDoc identifier into an APIModel or returns null if
     * unable to find a match. This is useful for both looking up an entry
     * for user input as well as resolving a TSDoc `@link` tag.
     *
     * For example:
     *
     *   // Simple selector
     *   api.resolve('MyClass.someMethod')
     *
     *   // Complex selector
     *   api.resolve('(MyClass:class).(someOverloadedMethod:1)')
     *
     */
    resolve<K extends Kind>(id: string, kind?: K): ModelByKind[K] | null {
        function next(current: RawAPIData, key: string, remainder: string): AnyRawModel | null {
            if (remainder === "") {
                return current[key] ? current[key].model : null
            } else {
                return current[key] ? walk(current[key].children, remainder) : null
            }
        }

        // Walk the tree of raw JSON objects to resolve the path provided, if
        // an ambiguous key has been provided then brute force the lookup by
        // comparing against potential keys.
        function walk(current: RawAPIData, path: string): AnyRawModel | null {
            const [key, ...rest] = path.split(".")
            const remainder = rest.join(".")

            // If the key is wrapped in parens then we assume its a proper id.
            if (key.startsWith("(") && key.endsWith(")")) {
                return next(current, key, remainder)
            } else {
                // If we're on the last item we can use a Kind hint to help
                // differentiate say from a function called Color and a
                // namespace called Color.
                if (kind && remainder === "") {
                    const potentials = keysForKind(key, kind)
                    for (const potential of potentials) {
                        const match = next(current, potential, remainder)
                        if (match) return match
                    }
                    // If provided a hint then bail.
                    return null
                }

                // Otherwise loop through all potential matches
                const potentials = potentialKeys(key)
                for (const potential of potentials) {
                    if (current[potential]) {
                        const match: AnyRawModel | null = next(current, potential, remainder)
                        if (match) return match
                    }
                }
            }

            return null
        }

        const json = walk(this.data, id.toLowerCase())
        return json ? (this.process(json) as ModelByKind[K]) : null
    }

    /**
     * Converts a RawModel into a standard Model, this mostly means replacing
     * id references within the raw representaton with an actual model.
     */
    private process(json: AnyRawModel): AnyModel {
        switch (json.kind) {
            case Kind.Class:
                return this.processClass(json)
            case Kind.Interface:
                return this.processInterface(json)
            case Kind.ConstructSignature:
            case Kind.Constructor:
            case Kind.Function:
            case Kind.Method:
            case Kind.MethodSignature:
                return this.processMethod(json)
            case Kind.Enum:
                return this.processEnum(json)
            case Kind.Namespace:
                return this.processNamespace(json)
            case Kind.EnumMember:
            case Kind.Parameter:
            case Kind.Property:
            case Kind.PropertySignature:
            case Kind.TypeAlias:
            case Kind.Variable:
                return { ...json }
            default:
                return assertNever(json)
        }
    }

    private processClass(json: RawClassModel): ClassModel {
        return {
            ...json,
            constructor: json.constructor ? this.get(json.constructor) : null,
            methods: this.toModels(json.methods),
            properties: this.toModels(json.properties),
        }
    }

    private processInterface(json: RawInterfaceModel): InterfaceModel {
        return {
            ...json,
            constructor: json.constructor ? this.get(json.constructor) : null,
            methods: this.toModels(json.methods),
            properties: this.toModels(json.properties),
        }
    }

    private processMethod(json: RawMethodModel): MethodModel {
        return {
            ...json,
            // Use empty array for overloaded methods otherwise we get recursion here.
            overloads: json.overloadIndex === 0 ? this.toModels(json.overloads) : [],
            parameters: this.toModels(json.parameters),
        }
    }

    private processEnum(json: RawEnumModel): EnumModel {
        return {
            ...json,
            fields: this.toModels(json.fields),
        }
    }

    private processNamespace(json: RawNamespaceModel): NamespaceModel {
        return {
            ...json,
            members: this.toModels(json.members),
        }
    }

    /** Convert an array of model ids to an array of models */
    private toModels<T extends AnyModel[]>(ids: string[]): T {
        return ids.map(this.get, this).filter(Boolean) as any
    }
}

function potentialKeys(name: string): string[] {
    // Strip trailing parentheses if provided, this is a convenience as
    // often people will provide them for methods, e.g. MyClass.method()
    name = name.replace(/\(\)$/, "")
    return [
        `${name}`, // Potential variable, enum field or property
        `(${name}:0)`, // Potential function
        `(${name}:1)`, // Potential function when extending a namespace
        `(${name}:instance)`, // Potential method with no overload
        `(${name}:instance,1)`, // Potential method with overload
        `(${name}:static)`, // Potential static method with no overload
        `(${name}:static,1)`, // Potential static method with overload
        `(${name}:class)`,
        `(${name}:interface)`,
        `(${name}:enum)`,
        `(${name}:function)`,
        `(${name}:variable)`,
        `(${name}:type)`,
        `(${name}:namespace)`,
    ]
}

function keysForKind(name: string, kind: Kind): string[] {
    name = name.replace(/\(\)$/, "")
    switch (kind) {
        case Kind.Class:
            return [`(${name}:class)`]
        case Kind.Interface:
            return [`(${name}:interface)`]
        case Kind.Constructor:
        case Kind.ConstructSignature:
            return [`(${name}:constructor)`]
        case Kind.Function:
            // Support override syntax. We go up to 1 because api-extractor
            // treats functions with namespace extensions as overrides.
            return [`(${name}:function)`, `(${name}:0)`, `(${name}:1)`]
        case Kind.Method:
        case Kind.MethodSignature:
            return [
                `(${name}:instance)`,
                `(${name}:instance,1)`,
                `(${name}:static)`,
                `(${name}:static,1)`,
                `(${name}:0)`,
                `(${name}:1)`, // This is an ugly hack to support api-exporter 7.7.8
            ]
        case Kind.Enum:
            return [`(${name}:enum)`]
        case Kind.Namespace:
            return [`(${name}:namespace)`]
        case Kind.EnumMember:
            return [name]
        case Kind.Parameter:
            return [`(${name}:parameter)`]
        case Kind.Property:
            // Support both Property & PropertySignature & MethodSignature here
            return [`(${name}:instance)`, `(${name}:0)`, name]
        case Kind.PropertySignature:
            return [name]
        case Kind.TypeAlias:
            return [name]
        case Kind.Variable:
            return [`(${name}:variable)`, name]
        default:
            return assertNever(kind)
    }
}

function assertNever(x: never): never {
    throw new Error("Unexpected object: " + x)
}
