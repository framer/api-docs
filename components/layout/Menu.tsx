import * as React from "react"
import styled from "styled-components"
import { urlFor, usePath, Dynamic } from "monobase"
import { tablet, mobile } from "./Breakpoints"
import { baseTextColor, menuTextColor } from "../theme"

const ListWrapper = styled.ul`
    padding-left: 20px;

    @media (max-width: 800px) {
        padding-left: 0;
    }
`

const SubTitleElement = styled.li`
    list-style: none;
    text-transform: uppercase;
    font-size: 10px;
    font-weight: 500;
    color: #aaa;
    letter-spacing: 0.5px;

    li + & {
        margin-top: 20px;
        padding-top: 20px;
        width: calc(100% - 20px);
    }

    @media (max-width: ${tablet}) {
        display: none;
    }
`
export const SubTitle: React.FunctionComponent<{ name: string }> = props => (
    <SubTitleElement>{props.name}</SubTitleElement>
)

const ListItem = styled.li`
    display: block;
    font-size: 15px;
    font-weight: 500;
    padding-top: 10px;
    transition: color 0.2s ease;
    list-style: none;

    a {
        color: ${menuTextColor};
    }
    &.active > a {
        color: #05f;
    }
    a:hover {
        color: #05f;
    }

    @media (max-width: ${tablet}) {
        font-size: 17px;
        border-bottom: 1px solid #eee;
        padding: 15px;

        a {
            display: block;
        }
    }
`
const SubSection = styled.ul`
    display: block;
    padding-left: 5px;
    margin-top: 10px;
    margin-bottom: 5px;
    font-size: 13px;
    font-weight: 400;
    color: ${baseTextColor};
    list-style: none;

    &:empty {
        display: none;
    }
    li a:hover {
        color: #05f;
    }
    li + li {
        margin-top: 5px;
    }
    @media (max-width: ${mobile}) {
        display: none;
    }
`

const SubItem: React.FunctionComponent<{ name: string; path: string }> = ({ path, name }) => (
    <li>
        <a href={path}>{name}</a>
    </li>
)

interface MenuItemProps {
    title: string
    href: string
    external?: boolean
    className?: string
}

export const Menu: React.FunctionComponent = ({ children }) => <ListWrapper>{children}</ListWrapper>

export const MenuItem: React.FunctionComponent<MenuItemProps> = props => {
    const { title, external } = props
    let { href, className = "" } = props
    let active = false

    if (external) {
        className += " external"
    } else {
        href = urlFor(href)
        active = href === usePath()
    }

    if (active) {
        className += " active"
    }

    return (
        <ListItem className={className.trim()}>
            <a href={href} target={external ? "_blank" : ""}>
                {title} {external ? "›" : null}
            </a>
            {active && !external ? <DynamicSubNavigation /> : null}
        </ListItem>
    )
}

/** Displays a SubNavigation containing all permalinks on the current page */
export const SubNavigation: React.FunctionComponent = () => {
    const [items, setItems] = React.useState<{ name: string; path: string }[]>([])
    const children = items.map(item => <SubItem key={item.path} {...item} />)

    React.useEffect(() => {
        const links: { name: string; path: string }[] = []
        Array.from(document.querySelectorAll<HTMLElement>("[data-permalink-id]")).forEach(el => {
            const id = el.dataset.permalinkId
            const name = el.dataset.permalinkName
            if (!name || !id) return

            const url = usePath() || ""
            const path = url + "#" + encodeURIComponent(id)
            links.push({ name, path })
        })
        setItems(links)
    }, [items.sort().join()])

    return <SubSection>{children}</SubSection>
}

export const DynamicSubNavigation = Dynamic(SubNavigation)
