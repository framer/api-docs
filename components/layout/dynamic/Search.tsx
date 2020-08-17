import * as React from "react"
import clsx from "classnames"
import { useRef, useEffect, useCallback, useState, FC, FormEvent } from "react"
import styled from "styled-components"
import { desktop, tablet } from "../Breakpoints"
import { Dynamic } from "monobase"
import { motion, AnimatePresence, Variants } from "framer-motion"
import groupBy from "lodash.groupby"
import { useClickOutside } from "../../hooks/useClickOutside"
import { useIndexItem } from "../../hooks/useIndex"

interface SearchResults {
    results: SearchResult[]
    selectedResult: SearchResult
    onResultChange: (index: number) => void
}

type SearchResultType = "page" | "section" | "subsection" | "property"

type SearchResultLibrary = "library" | "motion"

interface SearchResult {
    type: SearchResultType
    library: SearchResultLibrary
    page: string
    title: string
    secondaryTitle?: string
    description: string
    href: string
}

interface SearchResultRecent extends SearchResult {
    lastViewed: number
}

const SearchWrapper = styled(motion.div)`
    position: fixed;
    top: 0;
    left: 250px;
    width: calc(100% - 250px);
    height: 100vh;
    z-index: 2000;
    pointer-events: none;

    &:focus-within {
        position: fixed;
    }

    @media (max-width: ${tablet}) {
        position: absolute;
        top: 58px;
        left: 0;
        width: 100%;
    }

    @media (min-width: ${desktop}) {
        width: calc(50% - 125px);
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
    pointer-events: all;
`

const SearchInputWrapper = styled.div`
    position: relative;
    height: 58px;
    z-index: 3000;
    pointer-events: all;
`

const SearchInput = styled.input`
    all: unset;
    position: relative;
    box-sizing: border-box;
    appearance: none;
    font-size: 1rem;
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
    height: auto;
    max-height: calc(100vh - 58px);
    overflow-y: auto;
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
    color: #111;

    &.active {
        color: var(--accent);
    }

    a {
        color: inherit;
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
/*
 * TODO: Library vs. Motion?

 * Result types:
 * - Page: Title (`h1`) and description (`span.lead`) → e.g. | Animation
 *                                                           | A set of properties and helpers for high-performance...
 *
 * - Section: Title (`h2`) and description (`h2 + p` or `h2 ~ h3`) → e.g. | Content
 *                                                                        | dragEnabled, wheelEnabled, direction...
 *
 *
 * - Subsection: Title (`{Section} > h3`) and description (`h3 + p`) → e.g. | Overview > **Transitions**
 *                                                                          | The transition for the values in animate...
 *
 * - Property: Title (Name: `.framer-property > h3` + Type: `.framer-property > h3 span:nth-of-type(1)`)
 *           and description (`.framer-property > p:nth-of-type(1)`) → e.g. | **ease:** Easing | Easing[]
 *                                                                          | The easing function to use. Set as one...
 */
const genericResults: SearchResult[] = [
    {
        type: "page",
        library: "library",
        page: "Animation",
        title: "Animation",
        description: "A set of properties and helpers for high-performance, declarative animations.",
        href: "/api/animation/",
    },
    {
        type: "section",
        library: "library",
        page: "Scroll",
        title: "Content",
        description: "dragEnabled, wheelEnabled, direction, contentOffsetX, contentOffsetY, scrollAnimate.",
        href: "/scroll/#content",
    },
    {
        type: "subsection",
        library: "library",
        page: "Animation",
        title: "Transitions",
        secondaryTitle: "Overview",
        description: "The transition for the values in animate can be set via the transition property.",
        href: "/scroll/#content",
    },
    {
        type: "property",
        library: "library",
        page: "Frame",
        title: "width",
        secondaryTitle: "number | string | MotionValue<number | string>",
        description:
            "Set the CSS width property. Set to 200 by default. Accepts all CSS value types (including pixels, percentages, keywords and more).",
        href: "/api/frame/#framelayoutproperties.width",
    },
]

const SearchResults: FC<SearchResults> = ({ results, selectedResult, onResultChange }) => {
    const categorisedResults = groupBy(results, "page")
    const categories = Object.keys(categorisedResults) || []

    const handleResultHover = useCallback(event => {
        const index = event.currentTarget.dataset.index

        onResultChange && onResultChange(index)
    }, [])

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
                            {categoryResults.map((result, index) => {
                                return (
                                    <SearchResult
                                        key={index}
                                        className={clsx(result.type, { active: selectedResult === result })}
                                        onPointerEnter={handleResultHover}
                                        data-index={results.findIndex(flatResult => flatResult === result)}
                                    >
                                        <a href={result.href}>
                                            {result.type === "page" && (
                                                <>
                                                    <h6>
                                                        <span>{result.secondaryTitle}</span>
                                                        {result.title}
                                                    </h6>
                                                    <p>{result.description}</p>
                                                </>
                                            )}
                                            {result.type === "section" && (
                                                <>
                                                    <h6>{result.title}</h6>
                                                    <p>{result.description}</p>
                                                </>
                                            )}
                                            {result.type === "subsection" && (
                                                <>
                                                    <h6>
                                                        <span>{result.secondaryTitle} › </span>
                                                        {result.title}
                                                    </h6>
                                                    <p>{result.description}</p>
                                                </>
                                            )}
                                            {result.type === "property" && (
                                                <>
                                                    <h6>
                                                        {result.title}: <span>{result.secondaryTitle}</span>
                                                    </h6>
                                                    <p>{result.description}</p>
                                                </>
                                            )}
                                        </a>
                                    </SearchResult>
                                )
                            })}
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
    const inputRef = useRef<HTMLInputElement>(null)
    const wrapperRef = useRef<HTMLDivElement>(null)
    const [value, setValue] = useState("")
    const [open, setOpen] = useState(false)
    const results = genericResults.filter(result => result.title.includes(value))
    const [selectedResult, previousResult, nextResult, setResult] = useIndexItem(results)

    const handleChange = useCallback((event: FormEvent<HTMLInputElement> | string) => {
        if (event.hasOwnProperty("currentTarget")) {
            setValue((event as FormEvent<HTMLInputElement>).currentTarget.value)
        } else {
            setValue(event as string)
        }
    }, [])

    const handleFocus = useCallback(() => {
        setOpen(true)
    }, [])

    const handleClickOutside = useCallback(() => {
        setOpen(false)
    }, [])

    const handleKey = useCallback(
        (event: KeyboardEvent) => {
            if (open) {
                switch (event.key) {
                    case "ArrowUp":
                        previousResult()
                        break
                    case "ArrowDown":
                        nextResult()
                        break
                    case "Escape":
                        setOpen(false)
                        break
                    case "Enter":
                        setOpen(false)
                        window.location.href = selectedResult.href
                        break
                }
            } else {
                if (document.activeElement === document.body || document.activeElement === null) {
                    if (event.key.length === 1) {
                        handleChange(event.key)
                        setOpen(true)
                    }
                }
            }
        },
        [open, selectedResult]
    )

    useEffect(() => {
        window.addEventListener("keydown", handleKey)

        return () => {
            window.removeEventListener("keydown", handleKey)
        }
    }, [open, selectedResult])

    useEffect(() => {
        if (open) {
            inputRef.current && inputRef.current.focus()
        } else {
            inputRef.current && inputRef.current.blur()
        }
    }, [open])

    useClickOutside(wrapperRef, handleClickOutside)

    return (
        <SearchWrapper>
            <AnimatePresence>
                {open && (
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
            <SearchInputWrapper ref={wrapperRef}>
                <SearchInput
                    ref={inputRef}
                    value={value}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    type="search"
                    placeholder="Start typing to search…"
                />
                {open && (
                    <SearchResultsDropdown>
                        <SearchResults results={results} selectedResult={selectedResult} onResultChange={setResult} />
                    </SearchResultsDropdown>
                )}
            </SearchInputWrapper>
        </SearchWrapper>
    )
}

export const Search = Dynamic(StaticSearch)
