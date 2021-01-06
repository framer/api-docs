export const decode = (string: string) => {
    const buffer = Buffer.from(string, "base64")

    return buffer.toString("ascii")
}
