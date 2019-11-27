import * as React from "react"
import { useState, FunctionComponent, FormEvent } from "react"
import styled from "styled-components"
import { desktop, tablet } from "../Breakpoints"
import { Dynamic } from "monobase"
import { motion, useInvertedScale } from "framer-motion"

interface Search {
    maxNumberOfResults: number
}

interface SearchResults extends Search {
    value: string
}

interface SearchResult {
    name: string
    type: string
    description: string
    page: string
    section: string
}

interface SearchResultRecent extends SearchResult {
    lastViewed: number
}

const dropdownVariants = {
    closed: {
        opacity: 0,
        pointerEvents: "none" as "none",
    },
    open: {
        opacity: 1,
        pointerEvents: "all" as "all",
    },
}

const SearchWrapper = styled.div`
    position: absolute;
    top: 58px;
    left: 0;
    width: 100vw;
    height: 58px;
    background: #fff;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    z-index: 2000;

    &:focus-within,
    &.focus {
        position: fixed;
    }

    @media (min-width: ${tablet}) {
        position: fixed;
        top: 0;
        left: 250px;
        width: calc(100vw - 250px);
    }

    @media (min-width: ${desktop}) {
        width: calc(50vw - 125px);
        max-width: 675px;
    }
`

const SearchInput = styled.input`
    all: unset;
    z-index: 3000;
    box-sizing: border-box;
    appearance: none;
    width: 100%;
    height: 100%;
    padding: 16px 20px 14px 46px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M7 13A6 6 0 107 1a6 6 0 000 12z' fill='transparent' stroke-width='2' stroke='%23ccc' /%3E%3Cpath d='M11.5 11.5L15 15' fill='transparent' stroke-width='2' stroke='%23ccc' stroke-linecap='round' /%3E%3C/svg%3E");
    background-size: 16px;
    background-position: 18px 20px;
    background-repeat: no-repeat;

    &::placeholder {
        color: #999;
    }
`

const SearchResultsBackdrop = styled(motion.div)`
    position: absolute;
    top: 58px;
    width: 100%;
    height: calc(100vh - 58px);

    &:before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        pointer-events: none;
        background: rgba(255, 255, 255, 0.9);
        transition: opacity 0.16s ease-in-out;
    }

    .focus &:before {
        opacity: 1;
        pointer-events: all;
    }
`

const SearchResultsDropdown = styled(motion.div)`
    position: relative;
    transform-origin: top center;
    overflow-y: auto;
    width: 100%;
    max-height: 100%;
    background: #fff;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
`

const SearchResults = styled(motion.ul)`
    transform-origin: top center;
    list-style: none;

    * {
        position: relative;
    }
`

const SearchGroup = styled(motion.li)`
    margin: 30px 30px 0;

    &:last-child {
        margin-bottom: 30px;
    }

    h5 {
        text-transform: uppercase;
        font-size: 10px;
        font-weight: 500;
        color: #aaa;
        letter-spacing: 0.5px;
        margin-bottom: 15px;
    }
`

const SearchGroupResults = styled(motion.ul)`
    list-style: none;
`

const SearchResult = styled(motion.li)`
    a {
        color: #111;
        transition: color 0.12s ease-in-out;

        &:hover,
        &.selected {
            color: var(--accent);
        }
    }

    &:not(:last-child) {
        margin-bottom: 20px;
    }

    h6 {
        font-size: 16px;
        font-weight: 500;
        margin-bottom: 5px;

        span {
            font-weight: 400;
            opacity: 0.5;
        }
    }

    p {
        font-size: 15px;
        opacity: 0.7;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`

const recentlyViewedResults: SearchResultRecent[] = [
    {
        name: "width",
        type: "number | string | MotionValue<number | string>",
        description:
            "Set the CSS width property. Set to 200 by default. Accepts all CSS value types (including pixels, percentages, keywords and more).",
        page: "Frame",
        section: "Layout",
        lastViewed: 1574849637,
    },
    {
        name: "opacity",
        type: "number | MotionValue<number>",
        description:
            "Set the opacity value, which allows you to make elements semi-transparent or entirely hidden. Useful for show-and-hide animations. Set to 1 by default.",
        page: "Frame",
        section: "Visual",
        lastViewed: 1574850002,
    },
]

const predictionResults: SearchResult[] = [
    {
        name: "width",
        type: "number | string | MotionValue<number | string>",
        description:
            "Set the CSS width property. Set to 200 by default. Accepts all CSS value types (including pixels, percentages, keywords and more).",
        page: "Frame",
        section: "Layout",
    },
    {
        name: "opacity",
        type: "number | MotionValue<number>",
        description:
            "Set the opacity value, which allows you to make elements semi-transparent or entirely hidden. Useful for show-and-hide animations. Set to 1 by default.",
        page: "Frame",
        section: "Visual",
    },
    {
        name: "damping",
        type: "number",
        description:
            "Strength of opposing force. If set to 0, spring will oscillate indefinitely. Set to 10 by default.",
        page: "Animation",
        section: "Spring",
    },
    {
        name: "stiffness",
        type: "number",
        description: "Stiffness of the spring. Higher values will create more sudden movement. Set to 100 by default.",
        page: "Animation",
        section: "Spring",
    },
]

const InvertedSearchResults: FunctionComponent<SearchResults> = ({ value, maxNumberOfResults }) => {
    const { scaleY } = useInvertedScale()

    return (
        <SearchResults style={{ scaleY }}>
            {value ? (
                Array.from(
                    predictionResults
                        .filter((_, i) => i < maxNumberOfResults)
                        .filter(result =>
                            [result.name, result.page, result.section]
                                .map(name => name.toLowerCase())
                                .some(name => name.includes(value.toLowerCase()))
                        )
                        .reduce(
                            (map: Map<string, SearchResult[]>, result) =>
                                map.set(result.page, [...(map.get(result.page) || []), result]),
                            new Map()
                        )
                ).map(([name, results]) => (
                    <SearchGroup key={name}>
                        <h5>{name}</h5>
                        <SearchGroupResults>
                            {results.map(result => (
                                <SearchResult key={result.name}>
                                    <a href="#">
                                        <h6>
                                            {result.name}: <span>{result.type}</span>
                                        </h6>
                                        <p>{result.description}</p>
                                    </a>
                                </SearchResult>
                            ))}
                        </SearchGroupResults>
                    </SearchGroup>
                ))
            ) : (
                <SearchGroup>
                    <h5>Recently viewed</h5>
                    <SearchGroupResults>
                        {recentlyViewedResults
                            .sort((a, b) => a.lastViewed - b.lastViewed)
                            .filter((_, i) => i < maxNumberOfResults)
                            .map(result => (
                                <SearchResult key={result.name}>
                                    <a href="#">
                                        <h6>
                                            {result.name}: <span>{result.type}</span>
                                        </h6>
                                        <p>{result.description}</p>
                                    </a>
                                </SearchResult>
                            ))}
                    </SearchGroupResults>
                </SearchGroup>
            )}
        </SearchResults>
    )
}

const StaticSearch: FunctionComponent<Search> = ({ maxNumberOfResults = 8 }) => {
    const [value, setValue] = useState("")
    const [focus, setFocus] = useState(false)
    const [index, setIndex] = useState(0)

    const handleChange = (event: FormEvent<HTMLInputElement>) => {
        setValue(event.currentTarget.value)
    }

    const handleFocus = () => {
        setFocus(true)
    }

    const handleBlur = () => {
        setFocus(false)
    }

    return (
        <SearchWrapper className={`search ${focus ? "focus" : ""}`}>
            <SearchInput
                value={value}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                type="search"
                placeholder="Search..."
            />
            <SearchResultsBackdrop>
                <SearchResultsDropdown
                    variants={dropdownVariants}
                    initial="closed"
                    animate={focus ? "open" : "closed"}
                    layoutTransition
                >
                    <InvertedSearchResults value={value} maxNumberOfResults={8} />
                </SearchResultsDropdown>
            </SearchResultsBackdrop>
        </SearchWrapper>
    )
}

export const Search = Dynamic(StaticSearch)
