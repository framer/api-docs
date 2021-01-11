import * as React from "react"
import clsx from "classnames"
import { memo, useRef, useEffect, useCallback, useState, useMemo, FC, FormEvent } from "react"
import styled from "styled-components"
import { desktop, tablet } from "../Breakpoints"
import { Dynamic } from "monobase"
import { motion, AnimatePresence, Variants } from "framer-motion"
import algoliasearch from "algoliasearch/lite"
import debounce from "lodash.debounce"
import groupBy from "lodash.groupby"
import { useClickOutside } from "../../hooks/useClickOutside"
import { useIndexItem } from "../../hooks/useIndex"
import { decode } from "../../utils/decode"
import { isMotion } from "../../utils/env"
import { getDeepValues } from "../../utils/getDeepValues"
import { Logo } from "../Logo"

const ALGOLIA_PROJECT_ID = "NEdBVDdKS1NFUA=="
const ALGOLIA_API_TOKEN = "ZDMzM2JjMzhlYTNkNWM5OWM4YTVhNjdlMDhiZTc1ODc="

interface SearchResults {
    categorisedResults: CategorisedResults
    indexedResults: SearchResult[]
    selectedResult: SearchResult
    onResultChange: (index: number) => void
}

type SearchResultType = "page" | "section" | "subsection" | "property" | "function"

type SearchResultLibrary = "library" | "motion"

interface SearchResult {
    objectID?: string
    type: SearchResultType
    library: SearchResultLibrary
    page: string
    title: string
    secondaryTitle?: string
    tertiaryTitle?: string
    description: string
    href: string
}

interface SearchResultRecent extends SearchResult {
    lastViewed: number
}

type CategorisedResults = Record<SearchResultLibrary, Record<string, SearchResult[]>>

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
    padding: 16px 72px 14px 46px;
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

const SearchSection = styled(motion.li)`
    padding: 32px;

    &:not(:last-of-type) {
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    }
`

const SearchSectionResults = styled(motion.ul)`
    list-style: none;
`

const SearchCategory = styled(motion.li)`
    &:not(:last-of-type) {
        margin-bottom: 32px;
    }

    h5 {
        display: inline-flex;
        place-content: center;
        text-transform: uppercase;
        font-size: 10px;
        font-weight: 500;
        color: #aaa;
        letter-spacing: 0.5px;
        margin-bottom: 22px;
    }
`

const CategoryLogo = styled(Logo)`
    color: inherit;
    margin-right: 0.68em;
    transform: translateY(12%);

    path {
        fill: currentColor;
    }
`

const SearchCategoryResults = styled(motion.ul)`
    list-style: none;
`

const SearchResult = styled(motion.li)`
    position: relative;
    display: grid;
    grid-template-columns: minmax(0, 1fr) max-content;
    color: #111;

    &:before {
        content: "";
        position: absolute;
        top: -16px;
        bottom: -16px;
        left: -16px;
        right: -16px;
        border-radius: 12px;
        z-index: 0;
    }

    &.active {
        color: #fff;

        &.library:before {
            background: var(--library);
        }

        &.motion:before {
            background: var(--motion);
        }
    }

    a {
        color: inherit;
        z-index: 1;
    }

    &:not(:last-child) {
        margin-bottom: 32px;
    }

    h6 {
        font-size: 16px;
        font-weight: 500;
        margin-bottom: 6px;

        span {
            font-weight: 400;
            opacity: 0.5;
        }
    }

    p {
        font-size: 15px;
        line-height: 1;
        opacity: 0.7;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`

const SearchResultReturn = styled.div`
    display: flex;
    place-content: center;
    place-items: center;
    width: 32px;
    height: 32px;
    border-radius: 6px;
    align-self: center;
    background: rgba(255, 255, 255, 0.3);
    margin-left: 16px;
    z-index: 1;

    svg {
        height: 14px;
        margin-right: 2px;
    }
`

const SearchKey = styled.div`
    color: #999;
    box-shadow: inset 0 0 0 1px #eee;
    padding: 4px 9px 2px;
    border-radius: 6px;
    font-weight: 500;
    font-size: 12px;
    pointer-events: none;
`

const SearchInputKey = styled(SearchKey)`
    position: absolute;
    top: 17px;
    right: 18px;
    opacity: 0;
    transition: opacity 0.2s ease-in-out;

    &.is-open {
        opacity: 1;
    }
`

const variants: Variants = {
    visible: { opacity: 1 },
    hidden: {
        opacity: 0,
    },
}

const flattenSearchResults = (categorisedResults: CategorisedResults): SearchResult[] => {
    return getDeepValues(categorisedResults)
}

const SearchResults: FC<SearchResults> = memo(
    ({ categorisedResults, indexedResults, selectedResult, onResultChange }) => {
        const sections = Object.entries(categorisedResults)
        const handleResultHover = useCallback(event => {
            const index = event.currentTarget.dataset.index

            onResultChange && onResultChange(index)
        }, [])

        return (
            <SearchResultsList>
                {sections.map(([library, sectionResults]) => {
                    const categories = Object.keys(sectionResults)

                    return (
                        <SearchSection key={library}>
                            <SearchSectionResults>
                                {categories.map((category: string) => {
                                    const categoryResults = sectionResults[category]

                                    return (
                                        <SearchCategory key={category}>
                                            <h5>
                                                <CategoryLogo library={library as SearchResultLibrary} height={10} />
                                                <span>{category}</span>
                                            </h5>
                                            <SearchCategoryResults>
                                                {categoryResults.map((result, index) => {
                                                    const isActive = selectedResult === result
                                                    const isMotion = result.library === "motion"

                                                    return (
                                                        <SearchResult
                                                            key={index}
                                                            className={clsx(result.type, {
                                                                active: isActive,
                                                                motion: isMotion,
                                                                library: !isMotion,
                                                            })}
                                                            onPointerEnter={handleResultHover}
                                                            data-index={indexedResults.findIndex(
                                                                index => index === result
                                                            )}
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
                                                                            {result.secondaryTitle && (
                                                                                <span>{result.secondaryTitle} › </span>
                                                                            )}
                                                                            {result.title}
                                                                        </h6>
                                                                        <p>{result.description}</p>
                                                                    </>
                                                                )}
                                                                {result.type === "property" && (
                                                                    <>
                                                                        <h6>
                                                                            {result.title}:{" "}
                                                                            <span>{result.secondaryTitle}</span>
                                                                        </h6>
                                                                        <p>{result.description}</p>
                                                                    </>
                                                                )}
                                                                {result.type === "function" && (
                                                                    <>
                                                                        <h6>
                                                                            {result.title}({result.tertiaryTitle}):{" "}
                                                                            <span>{result.secondaryTitle}</span>
                                                                        </h6>
                                                                        <p>{result.description}</p>
                                                                    </>
                                                                )}
                                                            </a>
                                                            {isActive && (
                                                                <SearchResultReturn>
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        viewBox="0 0 14 14"
                                                                    >
                                                                        <path
                                                                            d="M12.25 1.5v3.75a3 3 0 01-3 3H3"
                                                                            fill="transparent"
                                                                            strokeWidth="1.5"
                                                                            stroke="#fff"
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                        />
                                                                        <path
                                                                            d="M6 4.25l-4 4 4 4"
                                                                            fill="transparent"
                                                                            strokeWidth="1.5"
                                                                            stroke="#fff"
                                                                            strokeLinecap="round"
                                                                        />
                                                                    </svg>
                                                                </SearchResultReturn>
                                                            )}
                                                        </SearchResult>
                                                    )
                                                })}
                                            </SearchCategoryResults>
                                        </SearchCategory>
                                    )
                                })}
                            </SearchSectionResults>
                        </SearchSection>
                    )
                })}
            </SearchResultsList>
        )
    }
)

const client = algoliasearch(decode(ALGOLIA_PROJECT_ID), decode(ALGOLIA_API_TOKEN))
const index = client.initIndex("prod_API")

const StaticSearch = () => {
    const inputRef = useRef<HTMLInputElement>(null)
    const wrapperRef = useRef<HTMLDivElement>(null)
    const [value, setValue] = useState("")
    const [open, setOpen] = useState(false)
    const openRef = useRef(open)
    const [results, setResults] = useState<SearchResult[]>([])
    const categorisedResults = useMemo(() => {
        const libraryDividedResults = groupBy(results, "library") as Record<SearchResultLibrary, SearchResult[]>
        const pageDividedResults: Partial<CategorisedResults> = {}

        for (const [library, results] of Object.entries(libraryDividedResults) as [
            SearchResultLibrary,
            SearchResult[]
        ][]) {
            pageDividedResults[library] = groupBy(results, "page")
        }

        return pageDividedResults as CategorisedResults
    }, [results])
    const indexedResults = useMemo(() => flattenSearchResults(categorisedResults), [categorisedResults])
    const [selectedResult, , previousResult, nextResult, setResult] = useIndexItem(indexedResults)
    const selectedResultRef = useRef(selectedResult)

    const search = useCallback(
        debounce((value: string) => {
            index
                .search(value, {
                    hitsPerPage: 10,
                    optionalFilters: [`library:${isMotion() ? "motion" : "library"}`],
                })
                .then(({ hits }) => {
                    setResults(hits as SearchResult[])
                })
                .catch(error => console.error(error))
        }, 200),
        []
    )

    const handleChange = useCallback((event: FormEvent<HTMLInputElement> | string) => {
        let value = event.hasOwnProperty("currentTarget")
            ? (event as FormEvent<HTMLInputElement>).currentTarget.value
            : (event as string)

        setValue(value)

        if (value) {
            search(value)
        } else {
            setResults([])

            search.cancel()
        }
    }, [])

    const handleFocus = useCallback(() => {
        setOpen(true)
    }, [])

    const handleClickOutside = useCallback(() => {
        setOpen(false)
    }, [])

    const handleKey = useCallback((event: KeyboardEvent) => {
        if (openRef.current) {
            switch (event.key) {
                case "ArrowUp":
                    event.preventDefault()
                    previousResult()
                    break
                case "ArrowDown":
                    event.preventDefault()
                    nextResult()
                    break
                case "Escape":
                    event.preventDefault()
                    setOpen(false)
                    break
                case "Enter":
                    event.preventDefault()
                    setOpen(false)
                    window.location.href = selectedResultRef.current.href
                    break
            }
        } else {
            if (document.activeElement === document.body || document.activeElement === null) {
                if (/^\w$/.test(event.key) && !event.metaKey && !event.ctrlKey && !event.altKey) {
                    event.preventDefault()

                    handleChange(event.key)
                    setOpen(true)
                }
            }
        }
    }, [])

    useEffect(() => {
        window.addEventListener("keydown", handleKey)

        return () => {
            window.removeEventListener("keydown", handleKey)
        }
    }, [])

    useEffect(() => {
        openRef.current = open

        if (open) {
            inputRef.current && inputRef.current.focus()
            document.documentElement.setAttribute("data-scroll", "false")
        } else {
            inputRef.current && inputRef.current.blur()
            document.documentElement.removeAttribute("data-scroll")
        }
    }, [open])

    useEffect(() => {
        selectedResultRef.current = selectedResult
    }, [selectedResult])

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
                <SearchInputKey className={open ? "is-open" : ""}>esc</SearchInputKey>
                {open && (
                    <SearchResultsDropdown>
                        <SearchResults
                            categorisedResults={categorisedResults}
                            indexedResults={indexedResults}
                            selectedResult={selectedResult}
                            onResultChange={setResult}
                        />
                    </SearchResultsDropdown>
                )}
            </SearchInputWrapper>
        </SearchWrapper>
    )
}

export const Search = Dynamic(StaticSearch)
