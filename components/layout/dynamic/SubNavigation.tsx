import * as React from "react"
import styled from "styled-components"
import { usePath, Dynamic } from "monobase"
import { mobile } from "../Breakpoints"
import { baseTextColor } from "../../theme"

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
        color: var(--accent);
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
