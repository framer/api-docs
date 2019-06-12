import { AedocDefinitions } from "@microsoft/api-extractor-model"
import { TSDocConfiguration, TSDocTagDefinition, TSDocTagSyntaxKind } from "@microsoft/tsdoc"

/**
 * Add support for `@motion` and `@library` documentation blocks.
 *
 * We monkey-patch `AedocDefinitions` which `APIModel` uses to configure its block support.
 * There currently isn't an external API to add this behaviour.
 */

export const configuration: TSDocConfiguration = AedocDefinitions.tsdocConfiguration

const production = new TSDocTagDefinition({
    tagName: "@motion",
    syntaxKind: TSDocTagSyntaxKind.BlockTag,
    allowMultiple: false,
})

const prototype = new TSDocTagDefinition({
    tagName: "@library",
    syntaxKind: TSDocTagSyntaxKind.BlockTag,
    allowMultiple: false,
})

configuration.addTagDefinitions([production, prototype], true)

configuration.setSupportForTags([production, prototype], true)

export function patchAPIExtractorWithCustomTSDocTags() {
    Object.defineProperty(AedocDefinitions, "tsdocConfiguration", {
        get: () => configuration,
    })
}
