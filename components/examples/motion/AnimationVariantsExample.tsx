import * as React from "react"
import { useEffect, useRef, RefObject } from "react"
import { Dynamic } from "monobase"
import { motion, useCycle, Variants, Transition } from "framer-motion"
import styled from "styled-components"

// Naive implementation - in reality would want to attach
// a window or resize listener. Also use state/layoutEffect instead of ref/effect
// if this is important to know on initial client render.
// It would be safer to  return null for unmeasured states.
const useDimensions = (ref: RefObject<HTMLElement>) => {
    const dimensions = useRef({ width: 0, height: 0 })

    useEffect(() => {
        if (!ref.current) return
        dimensions.current.width = ref.current.offsetWidth
        dimensions.current.height = ref.current.offsetHeight
    }, [])

    return dimensions.current
}

interface PathProps {
    d?: string
    variants?: Variants
    transition?: Transition
}

const Path = (props: PathProps) => (
    <motion.path fill="transparent" strokeWidth="3" stroke="hsl(0, 0%, 18%)" strokeLinecap="round" {...props} />
)

const itemVariants = {
    open: {
        y: 0,
        opacity: 1,
        transition: {
            y: { stiffness: 1000, velocity: -100 },
        },
    },
    closed: {
        y: 50,
        opacity: 0,
        transition: {
            y: { stiffness: 1000 },
        },
    },
}

const colors = ["#FF008C", "#D309E1", "#9C1AFF", "#7700FF", "#4400FF"]

const MenuItem = ({ i }: { i: number }) => {
    const style = { border: `2px solid ${colors[i]}` }
    return (
        <motion.li variants={itemVariants} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <div className="icon-placeholder" style={style} />
            <div className="text-placeholder" style={style} />
        </motion.li>
    )
}

const ToggleButton = styled.button`
    outline: none;
    border: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    cursor: pointer;
    position: absolute;
    top: 18px;
    left: 15px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: transparent;
`

const MenuToggle = ({ toggle }: { toggle: () => void }) => (
    <ToggleButton onClick={toggle}>
        <svg width="23" height="23" viewBox="0 0 23 23">
            <Path
                variants={{
                    closed: { d: "M 2 2.5 L 20 2.5" },
                    open: { d: "M 3 16.5 L 17 2.5" },
                }}
            />
            <Path
                d="M 2 9.423 L 20 9.423"
                variants={{
                    closed: { opacity: 1 },
                    open: { opacity: 0 },
                }}
                transition={{ duration: 0.1 }}
            />
            <Path
                variants={{
                    closed: { d: "M 2 16.346 L 20 16.346" },
                    open: { d: "M 3 2.5 L 17 16.346" },
                }}
            />
        </svg>
    </ToggleButton>
)

const navVariants: Variants = {
    open: {
        transition: { staggerChildren: 0.07, delayChildren: 0.2 },
    },
    closed: {
        transition: { staggerChildren: 0.05, staggerDirection: -1 },
    },
}

const NavContainer = styled(motion.ul)`
    padding: 25px;
    padding-left: 28px;
    position: absolute;
    top: 60px;
    width: 250px;
    margin: 0;
    list-style: none !important;

    li {
        list-style: none !important;
        display: flex;
        align-items: center;
        cursor: pointer;
        padding: 0;
        margin-bottom: 10px !important;
        margin-left: 0 !important;

        &:before {
            display: none;
        }
    }

    .icon-placeholder {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        flex: 40px 0;
        margin-right: 20px;
    }

    .text-placeholder {
        border-radius: 5px;
        width: 200px;
        height: 20px;
        flex: 1;
        margin-top: 0 !important;
    }
`

const Navigation = () => (
    <NavContainer variants={navVariants}>
        {itemIds.map(i => (
            <MenuItem i={i} key={i} />
        ))}
    </NavContainer>
)

const itemIds = [0, 1, 2, 3]

const sidebar = {
    open: (height = 1000) => ({
        clipPath: `circle(${height * 2 + 200}px at 40px 40px)`,
        transition: {
            type: "spring",
            stiffness: 20,
            restDelta: 2,
        },
    }),
    closed: {
        clipPath: "circle(30px at 40px 40px)",
        transition: {
            delay: 0.5,
            type: "spring",
            stiffness: 400,
            damping: 40,
        },
    },
}

const Sidebar = styled(motion.nav)`
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 300px;
`

const Background = styled(motion.div)`
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 300px;
    background: #fff;
`

function StaticVariantsExample() {
    const [isOpen, toggleOpen] = useCycle(false, true)
    const containerRef = useRef(null)
    const { height } = useDimensions(containerRef)

    return (
        <Sidebar initial={false} animate={isOpen ? "open" : "closed"} custom={height} ref={containerRef}>
            <Background variants={sidebar} />
            <Navigation />
            <MenuToggle toggle={() => toggleOpen()} />
        </Sidebar>
    )
}

export const AnimationVariantsExample = Dynamic(StaticVariantsExample)
