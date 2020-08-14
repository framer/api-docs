import * as React from "react"
import clsx from "classnames"
import { useEffect, useCallback, useState, FC, FormEvent } from "react"
import styled from "styled-components"
import { desktop, tablet } from "../Breakpoints"
import { Dynamic } from "monobase"
import { motion, AnimatePresence, Variants } from "framer-motion"
import groupBy from "lodash.groupby"
import { useIndexItem } from "../../hooks/useIndex"

interface SearchResults {
    results: SearchResult[]
    selectedResult: SearchResult
}

interface SearchResult {
    name: string
    type: string
    description: string
    page: string
    section: string
    href: string
}

interface SearchResultRecent extends SearchResult {
    lastViewed: number
}

const SearchWrapper = styled(motion.div)`
    position: absolute;
    top: 58px;
    left: 0;
    width: 100vw;
    height: 58px;
    z-index: 2000;

    &:focus-within {
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

const SearchBackdrop = styled(motion.div)`
    position: absolute;
    top: 58px;
    left: 0;
    width: 100%;
    height: calc(100vh - 58px);
    background: rgba(255, 255, 255, 0.9);
    z-index: 0;
`

const SearchInput = styled.input`
    all: unset;
    position: relative;
    box-sizing: border-box;
    appearance: none;
    z-index: 3000;
    width: 100%;
    height: 100%;
    padding: 16px 20px 14px 46px;
    background-color: #fff;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M7 13A6 6 0 107 1a6 6 0 000 12z' fill='transparent' stroke-width='2' stroke='%23ccc' /%3E%3Cpath d='M11.5 11.5L15 15' fill='transparent' stroke-width='2' stroke='%23ccc' stroke-linecap='round' /%3E%3C/svg%3E");
    background-size: 16px;
    background-position: 18px 20px;
    background-repeat: no-repeat;
    box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.05);

    &::-ms-clear {
        display: none;
        width: 0;
        height: 0;
    }
    &::-ms-reveal {
        display: none;
        width: 0;
        height: 0;
    }

    &::-webkit-search-decoration,
    &::-webkit-search-cancel-button,
    &::-webkit-search-results-button,
    &::-webkit-search-results-decoration {
        display: none;
    }

    &::placeholder {
        color: #999;
    }
`

const SearchResultsDropdown = styled(motion.div)`
    position: absolute;
    width: 100%;
    background: #fff;
    box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.05);
`

const SearchResultsList = styled(motion.ul)`
    list-style: none;
`

const SearchCategory = styled(motion.li)`
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

const SearchCategoryResults = styled(motion.ul)`
    list-style: none;
`

const SearchResult = styled(motion.li)`
    a {
        color: #111;

        &:hover {
            color: var(--accent);
        }
    }

    &.active a {
        color: var(--accent);
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
        href: "/api/frame/#framelayoutproperties.width",
        lastViewed: 1574849637,
    },
    {
        name: "opacity",
        type: "number | MotionValue<number>",
        description:
            "Set the opacity value, which allows you to make elements semi-transparent or entirely hidden. Useful for show-and-hide animations. Set to 1 by default.",
        page: "Frame",
        section: "Visual",
        href: "/api/frame/#visualproperties.opacity",
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
        href: "/api/frame/#framelayoutproperties.width",
    },
    {
        name: "opacity",
        type: "number | MotionValue<number>",
        description:
            "Set the opacity value, which allows you to make elements semi-transparent or entirely hidden. Useful for show-and-hide animations. Set to 1 by default.",
        page: "Frame",
        section: "Visual",
        href: "/api/frame/#visualproperties.opacity",
    },
    {
        name: "damping",
        type: "number",
        description:
            "Strength of opposing force. If set to 0, spring will oscillate indefinitely. Set to 10 by default.",
        page: "Animation",
        section: "Spring",
        href: "/api/animation/#spring.damping",
    },
    {
        name: "stiffness",
        type: "number",
        description: "Stiffness of the spring. Higher values will create more sudden movement. Set to 100 by default.",
        page: "Animation",
        section: "Spring",
        href: "/api/animation/#spring.stiffness",
    },
]

const SearchResults: FC<SearchResults> = ({ results, selectedResult }) => {
    const categorisedResults = groupBy(results, "page")
    const categories = Object.keys(categorisedResults) || []

    // TODO: State → Recently viewed
    // TODO: State → No results

    return (
        <SearchResultsList>
            {categories.map(category => {
                const categoryResults = categorisedResults[category]

                return (
                    <SearchCategory key={category}>
                        <h5>{category}</h5>
                        <SearchCategoryResults>
                            {categoryResults.map(result => (
                                <SearchResult key={result.name} className={clsx({ active: selectedResult === result })}>
                                    <a href={result.href}>
                                        <h6>
                                            {result.name}: <span>{result.type}</span>
                                        </h6>
                                        <p>{result.description}</p>
                                    </a>
                                </SearchResult>
                            ))}
                        </SearchCategoryResults>
                    </SearchCategory>
                )
            })}
        </SearchResultsList>
    )
}

const variants: Variants = {
    visible: { opacity: 1 },
    hidden: {
        opacity: 0,
    },
}

const StaticSearch = () => {
    const [value, setValue] = useState("")
    const [focus, setFocus] = useState(false)
    const results = predictionResults.filter(result => result.name.includes(value))
    const [selectedResult, previousResult, nextResult] = useIndexItem(results)

    const handleChange = (event: FormEvent<HTMLInputElement>) => {
        setValue(event.currentTarget.value)
    }

    const handleFocus = useCallback(() => {
        setFocus(true)
    }, [])

    const handleBlur = useCallback(() => {
        setFocus(false)
    }, [])

    const handleKey = useCallback(
        (event: KeyboardEvent) => {
            switch (event.key) {
                case "ArrowUp":
                    previousResult()
                    break
                case "ArrowDown":
                    nextResult()
                    break
                case "Enter":
                    window.location.href = selectedResult.href
                    break
            }
        },
        [selectedResult]
    )

    useEffect(() => {
        window.addEventListener("keydown", handleKey)

        return () => {
            window.removeEventListener("keydown", handleKey)
        }
    }, [handleKey])

    return (
        <SearchWrapper>
            <AnimatePresence>
                {focus && (
                    <SearchBackdrop
                        key="backdrop"
                        variants={variants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        transition={{
                            ease: "easeInOut",
                            duration: 0.2,
                        }}
                    />
                )}
            </AnimatePresence>
            <SearchInput
                value={value}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                type="search"
                placeholder="Search..."
            />
            {focus && (
                <SearchResultsDropdown>
                    <SearchResults results={results} selectedResult={selectedResult} />
                </SearchResultsDropdown>
            )}
        </SearchWrapper>
    )
}

export const Search = Dynamic(StaticSearch)
