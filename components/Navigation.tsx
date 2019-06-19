import * as React from "react"
import { Menu, MenuItem, SubTitle } from "./layout/Menu"
import { isMotion } from "./utils/env"

const MotionMenu = () => {
    return (
        <Menu>
            <SubTitle name="Get Started" />
            <MenuItem className="home" href="/pages/motion/index.mdx" title="Introduction" />

            <SubTitle name="Motion API" />
            <MenuItem className="components" href="/pages/motion/component.mdx" title="Motion components" />
            <MenuItem className="animation" href="/pages/motion/animation.mdx" title="Animation" />
            <MenuItem className="gestures" href="/pages/motion/gestures.mdx" title="Gestures" />
            <MenuItem className="types" href="/pages/motion/types.mdx" title="Types" />
        </Menu>
    )
}

const LibraryMenu = () => {
    return (
        <Menu>
            <SubTitle name="Get Started" />
            <MenuItem className="home" href="/pages/index.mdx" title="Introduction" />
            <MenuItem className="guide" href="/pages/tutorial.mdx" title="Tutorial" />
            <MenuItem className="examples" href="/pages/examples.mdx" title="Examples" />
            <MenuItem className="guide" href="http://bit.ly/framer-react" title="ES6 and React" external />

            <SubTitle name="Library" />
            <MenuItem className="frame" href="/pages/frame.mdx" title="Frame" />

            <MenuItem className="animation" href="/pages/animation.mdx" title="Animation" />
            <MenuItem className="color" href="/pages/color.mdx" title="Color" />
            <MenuItem className="page" href="/pages/page.mdx" title="Page" />
            <MenuItem className="scroll" href="/pages/scroll.mdx" title="Scroll" />
            <MenuItem className="stack" href="/pages/stack.mdx" title="Stack" />
            <MenuItem className="stack" href="/pages/utilities.mdx" title="Utilities" />

            <SubTitle name="Framer X" />
            <MenuItem className="assets" href="/pages/assets.mdx" title="Assets" />
            <MenuItem className="data" href="/pages/data.mdx" title="Data" />
            <MenuItem className="canvas-components" href="/pages/canvas-components.mdx" title="CanvasComponents" />
            <MenuItem className="property-controls" href="/pages/property-controls.mdx" title="PropertyControls" />
            <MenuItem className="render-target" href="/pages/render-target.mdx" title="RenderTarget" />
        </Menu>
    )
}

/** Represents the main navigation for the site */
export const Navigation: React.FunctionComponent = () => {
    return isMotion() ? <MotionMenu /> : <LibraryMenu />
}
