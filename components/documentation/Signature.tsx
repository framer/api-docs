import * as React from "react"

export const Signature: React.FunctionComponent<{ signature: string | null }> = ({ signature }) => {
    if (!signature) return null
    const [method, ...types] = signature.split(":")
    return (
        <>
            {method}:{" "}
            <span style={{ color: "grey" }} className="addition">
                {types.join(":")}
            </span>
        </>
    )
}
