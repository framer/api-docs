<h1 align="center">
    <img src="https://misc.framerstatic.com/repos/api-logo.png" width="40"/>
    <br>
    Contributing
</h1>

### Get Started

Every page has an **Edit Page** button in the top right hand side.
Clicking this will open the respective page for editing on GitHub. Please note that you need to be logged in to GitHub first.

#### Editing

The pages use the [mdx][#mdx] format which is a combination of
[Markdown][#markdown] and JSX allowing you to embed your prose with generated
API documentation. Though having a basic understanding of markdown should be
enough to make a simple edit.

![The GitHub Editor](https://misc.framerstatic.com/repos/contributing/github-editor.png)

Once you've made your edit scroll down to the bottom of the editor. To find
the submission form (titled "Commit Changes"). You'll see a different form
depending on whether your a member of the Framer team or not. In either case
fill in a short summary of the changes made and click the "Propose file
change" button.

![The Commit Form](https://misc.framerstatic.com/repos/contributing/guest-commit-ui.png)

If you're a member of the Framer team, you'll need to select the second
option, "Create a new branch...", to open a ticket for review.

![The Team Form](https://misc.framerstatic.com/repos/contributing/team-commit-ui.png)

This will then open a ticket for the project maintainers to review before
publishing the changes.

[#github]: https://github.com
[#mdx]: https://mdxjs.com/
[#markdown]: https://www.markdownguide.org/basic-syntax

#### Adding New Pages

New pages can be added to the documentation by navigating to the **/pages/api** directory
in the GitHub repository and clicking the "Create new file" button.

![Create New File](https://misc.framerstatic.com/repos/contributing/new-file-ui.png)

Give your file a name with the `.mdx` file extension, for example (color.mdx).
You'll then need to include the generic boilerplate for a page.

```tsx
import { Template } from "../components/Template"
export default Template('Page title')

## <Insert Page Title>
```

Add the rest of your content and follow the same publish steps outlined above.

### Adding Code Examples

We support adding code examples. Just use the markdown syntax for a code
block, three back-ticks followed by the language (e.g `jsx`, the documentation should
always use JavaScript for all examples). For example, the `Color()` function allows
you to work with and manipulate colors:

    ```jsx
    const color = Color("#fafafa")
    const brighter = Color.brighten(color, 20)
    ```

### Viewing Generated API Documentation

It can be tricky to determine which parts of the page are generated documentation and
which can be edited via the documentation site. To make this a bit easier we've added
a "debug" mode that puts a colored overlay on top of any parts of the site that
require editing the documentation in the source code to change.

To toggle this on/off just press <kbd>ctrl-d</kbd>.

### Documenting API Entities

We provide a number of React components that can document variables, functions
and other entities from the codebase. Each component takes a `name` prop that
refers to its contents. The [/debug](https://0.0.0.0:1234/api/debug/) page has a
list of all the available API entities.

The identifier should be compatible with the [TSDoc reference][#ref] format.

[#ref]: https://github.com/Microsoft/tsdoc/blob/6034bee3ec51c50682e087625023b939afeb42e2/spec/code-snippets/DeclarationReferences.ts

The various components must be imported from the `components` module at
the top of your page:

```tsx
import { Template, APIFunction, APIClass, APIEnum } from "../components"
```

#### &lt;APIFunction>

Displays a summary of the function including its arguments and return value.

```tsx
The `Color()` function allows you to work with and manipulate colors:

<APIFunction name="Color()" />
```

-   `name` - The full name identifier for the function to document including namespace and parentheses.

#### &lt;APIClass>

Displays a summary of the class including details of its constructor,
methods and properties.

```tsx
// The `SpringAnimator()` class can be used to transition properties using a spring curve:

<APIClass name="SpringAnimator()" />
```

-   `name` - The full name identifier for the class including parentheses

#### &lt;APIInterface>

Displays a summary of the interface including details of any methods and properties.

```tsx
// The `ScrollEvents` interface describes a subset of the props of the Scroll element that can be used to listen for changes.

<APIInterface name="ScrollEvents" />
```

-   `name` - The full name identifier for the interface

#### &lt;APIMergedInterface>

Will render documentation for a typescript interface and combine it with the properties and
methods from any additional interfaces provided via the `extras` prop. This is useful when
an interface extends a number of other interfaces but you want to document them all in a
single place. For example props for a React component.

```tsx
// The `ScrollEvents` interface describes a subset of the props of the Scroll element that can be used to listen for changes.

<APIMergedInterface name="ScrollProps" extras={["ScrollEvents", "ScrollProperties"]} />
```

-   `name` - The full name identifier for the interface

#### &lt;APIEnum>

Displays a summary of the enum including documentation for each of its fields.

```tsx
// The `ControlType` enum describes each of the UI controls that can be used in code components.

<APIEnum name="ControlType" />
```

To manually lay out the members you can override the `members` property:

```tsx
<APIEnum name="ControlType" overrides={{members: []}} />
<APIEnumField name="ControlType.string" />
```

#### &lt;APIEnumField>

Displays a summary of a single enum field.

```tsx
// The `ControlType.string` represents a string

<APIEnum name="ControlType.string" />
```

#### &lt;Link>

Allows you to link to other pages within the documentation website.

```mdx
... for more information see the <Link href="/color/">Color</Link> documentation.
```

-   `href` - The full path to the page to be linked to. The site will generate the correct path.

#### &lt;Ref>

Allows you to link to an API entity (NOTE: this will not work on the local
development server).

```mdx
... for more information see the <Ref name="Color.mix">Color.mix()</Ref> documentation.
```

-   `name` - The identifier for the entry you would like to link to.

### Overrides

You can add additional content to any of the above API components as well as overriding any property on the model
via the `override` prop. For example:

```tsx
<APIFunction name="color()" override={{ signature: "color(r, g, b): Color" }}>
    This is some extra content that will appear below the extracted API overview.
</APIFunction>
```

NOTE: Currently we don't support adding additional code blocks within an API component. This is due to constraints
with the grid system.

## Layout and Formatting

Each high level module that we want to document should have a corresponding file in the **pages**
directory. We also need to keep the table of contents in the
[Navigation.tsx](./components/Navigation.tsx) file up-to-date.
