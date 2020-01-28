import * as React from "react"
import * as renderer from "react-test-renderer"
import { TSDocParser } from "@microsoft/tsdoc"
import { renderTSDoc } from "../TSDocReactEmitter"
import { configuration } from "../custom-blocks"

function createTestComponent(doc: string): renderer.ReactTestRenderer {
    const parser = new TSDocParser(configuration)
    const parsed = parser.parseString(doc)
    const element = renderTSDoc(parsed.docComment, React)
    if (!React.isValidElement(element)) throw new Error("renderTSDoc did not return an element")
    return renderer.create(element)
}

function createParamComponent(param: string): renderer.ReactTestRenderer {
    const parser = new TSDocParser()
    const parsed = parser.parseString(param)
    const element = renderTSDoc(parsed.docComment.params.getChildNodes()[0], React)
    if (!React.isValidElement(element)) throw new Error("renderTSDoc did not return an element")
    return renderer.create(element)
}

describe("TSDocReactEmitter", () => {
    test("renders a basic string", () => {
        const component = createTestComponent(`
        /**
         * Hello World
         */`)
        expect(component.toJSON()).toMatchSnapshot()
    })

    test("renders a custom tag", () => {
        /**
         * If this snapshot test fails, you've probably upgraded one or more of:
         *  - @microsoft/tsdocs
         *  - @microsoft/api-extractor
         *  - @microsoft/api-extractor-model
         *
         * The first thing to check is that they're all referencing each other correctly. If
         * any of them reference a version of any of the others that is different than the one
         * we've specified, tsdocs is probably using a different version of AedocDefinitions.
         *
         * Upgrading them all to the latest version is probably the best approach.
         *
         * There may also be an official API to add custom block support in later versions.
         */
        const component = createTestComponent(`
        /**
         * Hello World
         *
         * @library
         * Hello prototype
         *
         * @motion
         * Hello production
         */`)
        expect(component.toJSON()).toMatchSnapshot()
    })

    test("renders several paragraphs", () => {
        const component = createTestComponent(`
        /**
         * First Paragraph
         *
         * Second Paragraph
         */`)
        expect(component.toJSON()).toMatchSnapshot()
    })

    test("renders a list of items using hyphens", () => {
        const component = createTestComponent(`
        /**
         * Preceding Text
         *
         * - This is item one
         * - This is item two with \`code\`
         * - This is item three with a {@link http://example.com}
         * - This is item four with a <b>Bold Tag</b>
         *
         * Trailing Text
         */`)
        expect(component.toJSON()).toMatchSnapshot()
    })

    test("supports a list item ending in code", () => {
        const component = createTestComponent(`
        /**
         * - This is an item with \`code\`
         */`)
        expect(component.toJSON()).toMatchSnapshot()
    })

    test("renders a list of items using asterisks", () => {
        const component = createTestComponent(`
        /**
         * Preceding Text
         *
         * * This is item one
         * * This is item two with \`code\`
         * * This is item three with a {@link http://example.com}
         * * This is item four with a <b>Bold Tag</b>
         *
         * Trailing Text
         */`)
        expect(component.toJSON()).toMatchSnapshot()
    })

    test("renders a code block", () => {
        const component = createTestComponent(`
        /**
         * Hello World
         *
         * @remarks
         * \`\`\`jsx
         * const foo = "bar";
         * \`\`\`
         */`)
        expect(component.toJSON()).toMatchSnapshot()
    })

    test("renders inline code blocks", () => {
        const component = createTestComponent(`
        /**
         * Hello World this is some \`code\`.
         */`)
        expect(component.toJSON()).toMatchSnapshot()
    })

    test("renders @link tags", () => {
        const component = createTestComponent(`
        /**
         * Hello World this is a website: {@link http://example.com}.
         */`)
        expect(component.toJSON()).toMatchSnapshot()
    })

    test("renders @link tags with text", () => {
        const component = createTestComponent(`
        /**
         * Hello World this is an {@link http://example.com | example}.
         */`)
        expect(component.toJSON()).toMatchSnapshot()
    })

    test("renders @link tags with references", () => {
        const component = createTestComponent(`
        /**
         * Hello World this is a reference {@link MyComponent.hello}.
         */`)
        expect(component.toJSON()).toMatchSnapshot()
    })

    test("renders @link tags with references and text", () => {
        const component = createTestComponent(`
        /**
         * Hello World this is a reference {@link MyComponent.hello | hello}.
         */`)
        expect(component.toJSON()).toMatchSnapshot()
    })

    test("supports @params with lists", () => {
        const component = createParamComponent(`
        /**
         * @param options -
         * - Clamp values to within the given range. Defaults to \`true\`
         */`)
        expect(component.toJSON()).toMatchSnapshot()
    })

    test("list regression test", () => {
        const component = createTestComponent(`
        /**
         * Defines the distribution of the stack contents. Set to \`"space-around"\` by default, which makes the contents spread evenly across the container.
         * @remarks
         *
         * - \`"start"\` — from the leading edge of the container.
         * - \`"center"\` — centered within the container.
         * - \`"end"\` — from the trailing edge of the container.
         * - \`"space-between"\` — spread evenly in the container.
         * - \`"space-around"\` — spread evenly with excess applied at the start / end.
         * - \`"space-evenly"\` — spread with equal padding between contents.
         *
         * \`\`\`jsx
         * // Default
         * <Stack distribution="space-around" />
         *
         * // Start
         * <Stack distribution="start" />
         *
         * // Center
         * <Stack distribution="center" />
         *
         * // End
         * <Stack distribution="end" />
         *
         * // Space Between
         * <Stack distribution="space-between" />
         *
         * // Space Around
         * <Stack distribution="space-around" />
         *
         * // Space Evenly
         * <Stack distribution="space-evenly" />
         * \`\`\`
         */`)
        expect(component.toJSON()).toMatchSnapshot()
    })
})
