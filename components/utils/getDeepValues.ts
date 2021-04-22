import isPlainObject from "lodash.isplainobject"

export const getDeepValues = <T>(object: Record<string, unknown>): T[] => {
    const values: T[] = []

    for (const value of Object.values(object)) {
        if (isPlainObject(value)) {
            const deepValues = getDeepValues(value as Record<string, unknown>)

            for (const deepValue of deepValues) {
                values.push(deepValue as T)
            }
        } else {
            values.push(...(value as T[]))
        }
    }

    return values
}
