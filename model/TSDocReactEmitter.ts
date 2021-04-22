import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import {
    DocNode,
    DocNodeKind,
    DocBlock,
    DocCodeSpan,
    DocComment,
    DocDeclarationReference,
    DocErrorText,
    DocEscapedText,
    DocFencedCode,
    DocHtmlStartTag,
    DocInlineTag,
    DocLinkTag,
    DocSection,
    DocParagraph,
    DocNodeTransforms,
    DocParamBlock,
    DocParamCollection,
    DocPlainText,
    PlainTextEmitter,
    TSDocEmitter,
    StringBuilder,
} from "@microsoft/tsdoc"

type CreateElementFn<T> = (tag: string | object, props?: object, children?: T | T[], ...rest: T[]) => T
type FragmentId = string | object
type LikeReact<T> = { createElement: CreateElementFn<T>; Fragment: FragmentId }

// Converts a TSDoc DocNode into an HTML string
// http://api-extractor.com/pages/tsdoc/syntax/
// https://github.com/Microsoft/tsdoc/blob/6034bee/spec/code-snippets/DeclarationReferences.ts
// https://github.com/Microsoft/tsdoc/tree/6034bee/tsdoc/src/emitters
// https://microsoft.github.io/tsdoc/#
export function renderTSDocToHTML(node: DocNode | undefined): string {
    const element: React.ReactElement | null = render(node, React)
    if (!element) return ""
    if (!React.isValidElement(element)) throw new Error(`render() returned non-ReactElement: ${typeof element}`)
    return renderToStaticMarkup(element)
}

// Converts a TSDoc DocNode into a tree, usually React but allows custom createElement and Fragment methods.
export function renderTSDoc<T>(node: DocNode | undefined, opts: LikeReact<T>): T | null {
    return render(node, opts)
}

function render<T>(docNode: DocNode | undefined, { createElement, Fragment }: LikeReact<any>): T | null {
    function renderNode(node: DocNode | undefined): T | null {
        return render(node, { createElement, Fragment })
    }
    function renderNodes(docNodes: ReadonlyArray<DocNode | undefined>): T[] {
        const rendered: (T | null)[] = []

        let idx = 0
        let n: DocNode | undefined

        // TODO: Re-write this to not be terrible.
        outer: while ((n = docNodes[idx])) {
            // TSDoc may include HTML markup, it processes this in a flat stream of DocNodes
            // that may look like [HtmlStartTag, HtmlStartTag, PlainText, HtmlEndTag, HtmlEndTag]
            // which is fine if you're rendering everything in series but we need to handle the
            // nesting manually for React.createElement(). So we break out an inner loop here
            // to process the children.
            if (n.kind === DocNodeKind.HtmlStartTag) {
                const html = n as DocHtmlStartTag

                const attrs: { [attr: string]: string } = {}
                for (const attr of html.htmlAttributes) {
                    attrs[attr.name] = attr.value
                }

                // Bail early if we find a self-closing tag.
                if (html.selfClosingTag) {
                    rendered.push(createElement(html.name, attrs))
                    idx += 1
                    continue
                }

                // Collect the children.
                let child: DocNode | undefined
                let childIdx = idx + 1 // Move on to next node and process children until we find a closing tag.
                let depth = 0 // Track the depth of nested HtmlStartTags
                const children: DocNode[] = []

                while (!html.selfClosingTag && (child = docNodes[childIdx])) {
                    if (child.kind === DocNodeKind.HtmlStartTag && !(child as DocHtmlStartTag).selfClosingTag) {
                        depth += 1
                    } else if (child.kind === DocNodeKind.HtmlEndTag) {
                        if (depth === 0) {
                            idx = childIdx + 1 // update parent index and continue the outer loop
                            rendered.push(createElement(html.name, attrs, renderNodes(children)))
                            continue outer
                        } else {
                            depth -= 1
                        }
                    }
                    children.push(child)
                    childIdx += 1
                }

                rendered.push(createElement(html.name, attrs))
            } else {
                rendered.push(renderNode(n))
            }
            idx += 1
        }

        // Need to provide a key for each element...
        return rendered.map((child, idx) => createElement(Fragment, { key: idx }, child))
    }

    if (docNode === undefined) {
        return null
    }

    // NOTE: Fragments are used to keep the HTML structure as flat as possible for styling.
    // ideally we want just one level of block elements, e.g <p>, <pre> etc.
    // We use the `key` attribute to tag the fragments to help identify the type of
    // DocNodeKind that created it for debugging.
    const kind = docNode.kind as DocNodeKind

    switch (kind) {
        // A semantic group of content denoted by a block tag
        case DocNodeKind.Block:
            const docBlock: DocBlock = docNode as DocBlock

            return createElement(Fragment, { key: "DocBlock" }, renderNode(docBlock.content))

        // A block tag, e.g. @remarks or @example
        case DocNodeKind.BlockTag:
            return null // We don't want to show @ tags

        // Inline code
        case DocNodeKind.CodeSpan:
            const docCodeSpan: DocCodeSpan = docNode as DocCodeSpan
            return createElement("code", { className: `DocCodeSpan` }, docCodeSpan.code)

        // Full TSDoc Comment denoted by /**  */
        case DocNodeKind.Comment:
            const docComment: DocComment = docNode as DocComment
            const content = renderNodes([
                ...docComment.customBlocks,
                docComment.summarySection,
                docComment.remarksBlock,
                docComment.privateRemarks,
                docComment.deprecatedBlock,
                docComment.params,
                docComment.typeParams,
                docComment.returnsBlock,
                docComment.inheritDocTag,
            ])
            if (docComment.modifierTagSet.nodes.length > 0) {
                //this._ensureLineSkipped()
                content.push(...renderNodes(docComment.modifierTagSet.nodes))
            }
            return createElement(Fragment, { key: "DocComment" }, content)

        // Package part of a link reference e.g. "pkg" in {@link pkg#MyClass.Button}
        // http://api-extractor.com/pages/tsdoc/syntax/#api-item-references
        case DocNodeKind.DeclarationReference:
            const docDeclarationReference: DocDeclarationReference = docNode as DocDeclarationReference
            let reference = `${docDeclarationReference.packageName || ""}${docDeclarationReference.importPath || ""}`
            if (docDeclarationReference.packageName !== undefined || docDeclarationReference.importPath !== undefined) {
                reference += "#"
            }
            return createElement(
                "code",
                { className: "DocDeclarationReference" },
                createElement("a", { "data-link-ref": "" }, [
                    reference,
                    ...renderNodes(docDeclarationReference.memberReferences),
                ])
            )

        // Error text...
        case DocNodeKind.ErrorText:
            const docErrorText: DocErrorText = docNode as DocErrorText
            return createElement("span", { className: "DocErrorText" }, docErrorText.text)

        // ???
        case DocNodeKind.EscapedText:
            const docEscapedText: DocEscapedText = docNode as DocEscapedText
            return createElement(Fragment, { key: "DocEscapedText" }, docEscapedText.encodedText)

        // Block level code denoted by three back-ticks ```tsx
        case DocNodeKind.FencedCode:
            const docFencedCode: DocFencedCode = docNode as DocFencedCode
            return createElement(
                "pre",
                { className: "DocFencedCode" },
                createElement(
                    "code",
                    {
                        "data-lang": docFencedCode.language,
                        className: `language-${docFencedCode.language}`,
                    },
                    docFencedCode.code
                )
            )

        case DocNodeKind.HtmlAttribute:
            throw new Error("Encountered unexpected HtmlAttribute. Should be handled by renderNodes()")

        case DocNodeKind.HtmlEndTag:
            throw new Error("Encountered unexpected HtmlEndTag. Should be handled by renderNodes()")

        case DocNodeKind.HtmlStartTag:
            throw new Error("Encountered unexpected HtmlStartTag. Should be handled by renderNodes()")

        // @inherit
        case DocNodeKind.InheritDocTag:
            //const docInheritDocTag: DocInheritDocTag = docNode as DocInheritDocTag
            return null // We don't want to render this tag

        // Inline custom tag e.g @foo can be wrapped in curly braces to include content e.g. {@foo bar}
        // http://api-extractor.com/pages/tsdoc/syntax/#inline-tags
        case DocNodeKind.InlineTag:
            const docInlineTag: DocInlineTag = docNode as DocInlineTag
            let docInlineContent = ""
            if (docInlineTag.tagContent.length > 0) {
                docInlineContent = " " + docInlineTag.tagContent
            }
            return createElement(Fragment, { key: "DocInlineTag" }, `{${docInlineTag.tagName}${docInlineContent}}`)

        // Inline @link tag.
        case DocNodeKind.LinkTag:
            const docLinkTag: DocLinkTag = docNode as DocLinkTag
            if (docLinkTag.codeDestination) {
                const ref = declarationReference(docLinkTag.codeDestination)
                const name = createElement("code", {}, declarationReferenceDisplayName(docLinkTag.codeDestination))
                return createElement("a", { className: "DocRefTag", "data-link-ref": ref }, docLinkTag.linkText || name)
            }
            let href = docLinkTag.urlDestination || "#"
            return createElement("a", { className: "DocLinkTag", href }, docLinkTag.linkText)

        // The "MyClass" and "foo" part of a {@link MyClass.Foo} reference
        case DocNodeKind.MemberIdentifier:
            throw new Error("Should be handled by renderDeclarationReference")

        // The "MyClass.Foo" part of a {@link MyClass.Foo} reference
        case DocNodeKind.MemberReference:
            throw new Error("Should be handled by renderDeclarationReference")

        // Part of a selectior {@link MyClass.(foo:1)} reference
        case DocNodeKind.MemberSelector:
            throw new Error("Should be handled by renderDeclarationReference")

        case DocNodeKind.MemberSymbol:
            throw new Error("Should be handled by renderDeclarationReference")

        // Every DocBlock has a corresponding section.
        case DocNodeKind.Section:
            const docSection: DocSection = docNode as DocSection
            if (docSection.nodes.length === 0 || !PlainTextEmitter.hasAnyTextContent(docSection)) return null
            return createElement(Fragment, { key: "DocSection" }, renderNodes(docSection.nodes))

        // A chunk of text seperated by two newlines.
        case DocNodeKind.Paragraph:
            const listDelimiter = /[*-]\s*/
            const trimmedParagraph: DocParagraph = DocNodeTransforms.trimSpacesInParagraph(docNode as DocParagraph)
            if (trimmedParagraph.nodes.length === 0) return null

            // TSDoc doesn't support lists but we'd like to render markdown style ones so if a paragraph
            // begins with a dash we break it down into list items by splitting on hyphens or asterisks.
            const firstChild = trimmedParagraph.nodes[0]
            const firstChildText = firstChild.kind === DocNodeKind.PlainText ? (firstChild as DocPlainText).text : null
            if (!firstChildText || firstChildText.search(listDelimiter) !== 0) {
                return createElement("p", {}, renderNodes(trimmedParagraph.nodes))
            }

            const items: DocNode[][] = []
            let fragments: DocNode[] = []
            trimmedParagraph.nodes.forEach(child => {
                if (child.kind === DocNodeKind.PlainText) {
                    const textNode = child as DocPlainText
                    if (listDelimiter.test(textNode.text)) {
                        const listText = textNode.text.split(listDelimiter)

                        // Create a list item with first part of the current
                        // text string plus previous fragments.
                        if (fragments.length || listText[0]) {
                            const textNode = new DocPlainText({
                                configuration: docNode.configuration,
                                text: listText.shift() || "",
                            })
                            items.push([...fragments, textNode])
                            fragments = []
                        }

                        // Save the last fragment for later
                        if (listText.length) {
                            const textNode = new DocPlainText({
                                configuration: docNode.configuration,
                                text: listText.pop() || "",
                            })

                            fragments.push(textNode)
                        }

                        // Create list items for each of the middle text strings.
                        const listItems = listText
                            .filter(text => text.trim())
                            .map(text => [new DocPlainText({ configuration: docNode.configuration, text })])
                        items.push(...listItems)
                    } else {
                        fragments.push(child)
                    }
                } else {
                    fragments.push(child)
                }
            })

            // Append remaining fragments
            if (fragments.length) {
                // If we have only fragments add a new line entry.
                if (items.length === 0) {
                    items.push([])
                }

                // If the first fragment is an empty string it's a new line
                // marker. Append a new list entry.
                if (fragments[0].kind === DocNodeKind.PlainText) {
                    const textNode = fragments[0] as DocPlainText
                    if (textNode.text === "") {
                        items.push([])
                    }
                }
                items[items.length - 1].push(...fragments)
            }

            const children = items.map(items => createElement("li", { key: id() }, renderNodes(items)))
            return createElement("ul", {}, children)

        // Defined by a @param
        // http://api-extractor.com/pages/tsdoc/syntax/#param
        case DocNodeKind.ParamBlock:
            const docParamBlock: DocParamBlock = docNode as DocParamBlock
            return createElement(
                "div",
                { className: "DocParamBlock" },
                createElement(Fragment, {}, docParamBlock.parameterName),
                " ",
                renderNode(docParamBlock.content)
            )

        // A collection of @param tags
        case DocNodeKind.ParamCollection:
            const docParamCollection: DocParamCollection = docNode as DocParamCollection
            return createElement(Fragment, { key: "DocParamCollection" }, renderNodes(docParamCollection.blocks))

        // Just good old fashioned text.
        case DocNodeKind.PlainText:
            const docPlainText: DocPlainText = docNode as DocPlainText
            return createElement(Fragment, { key: "DocPlainText" }, docPlainText.text)
        case DocNodeKind.Excerpt:
            return null
        // A single newline
        case DocNodeKind.SoftBreak:
            return null
        default:
            return assertNever(kind)
    }
}

function assertNever(x: never): never {
    throw new Error("Unexpected object: " + x)
}

let moduleId = 0
function id() {
    return ++moduleId
}

function declarationReferenceDisplayName(node: DocDeclarationReference): string {
    let name: string[] = []
    for (const member of node.memberReferences) {
        if (member.hasDot) {
            name.push(".")
        }
        if (member.memberIdentifier) {
            name.push(member.memberIdentifier.identifier)
        }
    }
    return name.join("")
}

function declarationReference(node: DocDeclarationReference) {
    const emitter = new TSDocEmitter()
    const builder = new StringBuilder()
    emitter.renderDeclarationReference(builder, node)
    return builder.toString()
}
