import * as React from "react"
import { Menu, MenuItem, SubTitle } from "./layout/Menu"
import { isMotion } from "./utils/env"

const MotionMenu = () => {
    return (
        <Menu>
            <SubTitle name="Get Started" />
            <MenuItem className="home" href="/pages/motion/index.mdx" title="Introduction" />
            <MenuItem className="examples" href="/pages/motion/examples.mdx" title="Examples" />
            <MenuItem className="help" href="/pages/motion/help.mdx" title="Help" />

            <SubTitle name="API" />
            <MenuItem className="animation" href="/pages/motion/animation.mdx" title="Animation" />
            <MenuItem className="gestures" href="/pages/motion/gestures.mdx" title="Gestures" />
            <MenuItem className="motionvalue" href="/pages/motion/motionvalue.mdx" title="MotionValue" />
            <MenuItem className="utilities" href="/pages/motion/utilities.mdx" title="Utilities" />
            <MenuItem className="types" href="/pages/motion/types.mdx" title="Types" />

            <SubTitle name="Components" />
            <MenuItem className="motion" href="/pages/motion/component.mdx" title="motion" />
            <MenuItem
                className="animate-shared-layout"
                href="/pages/motion/animate-shared-layout.mdx"
                title="AnimateSharedLayout"
            />
            <MenuItem className="animate-presence" href="/pages/motion/animate-presence.mdx" title="AnimatePresence" />
            <MenuItem className="lazy-motion" href="/pages/motion/lazy-motion.mdx" title="LazyMotion" />
            <MenuItem className="motion-config" href="/pages/motion/motion-config.mdx" title="MotionConfig" />

            <SubTitle name="Guides" />
            <MenuItem
                className="guide-accessibility"
                href="/pages/motion/guide-accessibility.mdx"
                title="Accessibility"
            />
            <MenuItem className="handoff" href="/pages/motion/handoff.mdx" title="Handoff from Framer" />

            <MenuItem
                className="guide-reduce-bundle-size"
                href="/pages/motion/guide-reduce-bundle-size.mdx"
                title="Reduce bundle size"
            />
            <MenuItem className="guide-upgrade" href="/pages/motion/guide-upgrade.mdx" title="Upgrade guides" />
            <MenuItem
                className="migrate-from-pose"
                href="/pages/motion/migrate-from-pose.mdx"
                title="Migrate from Pose"
            />
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
            <MenuItem
                className="guide"
                href="https://www.framer.com/books/framer-guide-to-react/"
                title="ES6 and React"
                external
            />
            <MenuItem className="help" href="/pages/help.mdx" title="Help" />

            <SubTitle name="Library" />
            <MenuItem className="frame" href="/pages/frame.mdx" title="Frame" />

            <MenuItem className="animation" href="/pages/animation.mdx" title="Animation" />
            <MenuItem className="color" href="/pages/color.mdx" title="Color" />
            <MenuItem className="page" href="/pages/page.mdx" title="Page" />
            <MenuItem className="scroll" href="/pages/scroll.mdx" title="Scroll" />
            <MenuItem className="stack" href="/pages/stack.mdx" title="Stack" />
            <MenuItem className="stack" href="/pages/utilities.mdx" title="Utilities" />

            <SubTitle name="Framer" />
            <MenuItem className="assets" href="/pages/assets.mdx" title="Assets" />
            <MenuItem className="data" href="/pages/data.mdx" title="Data &amp; Overrides" />
            <MenuItem className="property-controls" href="/pages/property-controls.mdx" title="PropertyControls" />
            <MenuItem className="render-target" href="/pages/render-target.mdx" title="RenderTarget" />
        </Menu>
    )
}

/** Represents the main navigation for the site */
export const Navigation: React.FunctionComponent = () => {
    return isMotion() ? <MotionMenu /> : <LibraryMenu />
}
