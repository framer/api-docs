export const isProduction = () => {
    return process.env.NODE_ENV === "production" && "CONTEXT" in process.env
        ? process.env.CONTEXT === "production"
        : false
}
