import { usePath } from "monobase"

export const isMotion = () => {
    return usePath().search("/motion") !== -1
}
