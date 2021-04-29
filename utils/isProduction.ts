export const isProduction = () => {
    return process?.env?.CONTEXT === "production"
}
