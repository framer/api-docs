// Library doesn't include its own definition, so here is a basic shim with what we need.
// https://github.com/mdx-js/mdx/blob/c46ffa9fd745269c1caf73432eb2fe23f4eeca8a/packages/tag/src/mdx-tag.js#L10
declare module "@mdx-js/tag" {
    export type MDXTagProps = { name: string }
    export const MDXTag: React.FunctionComponent<MDXTagProps>
}
