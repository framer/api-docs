import * as React from "react"
import clsx from "classnames"
import { memo, useRef, useEffect, useCallback, useState, useMemo, FC, FormEvent } from "react"
import styled from "styled-components"
import { desktop, tablet } from "../Breakpoints"
import { Dynamic } from "monobase"
import { motion, AnimatePresence, Transition, Variants } from "framer-motion"
import algoliasearch from "algoliasearch/lite"
import debounce from "lodash.debounce"
import groupBy from "lodash.groupby"
import { useClickOutside } from "../../hooks/useClickOutside"
import { useIndexItem } from "../../hooks/useIndex"
import { isMotion } from "../../utils/env"
import { getDeepValues } from "../../utils/getDeepValues"
import { Logo } from "../Logo"

const SEARCH_HEIGHT = 58
const SEARCH_EMPTY_HEIGHT = 80
const SEARCH_OPEN_DELAY = 0.24
const CATEGORY_SEPARATOR = "__"

type SearchResultType = "page" | "section" | "subsection" | "property" | "function"

type SearchResultLibrary = "library" | "motion"

interface HighlightResult {
    value: string
    matchLevel: "none" | "partial" | "full"
    fullyHighlighted: boolean
    matchedWords: string[]
}

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
    _highlightResult?: Record<string, HighlightResult>
}

type CategorisedResults = Record<string, SearchResult[]>

interface SearchResultProps {
    index: number
    result: SearchResult
    selectedResult: SearchResult
    onResultClick: () => void
    onResultChange: (index: number) => void
}

interface SearchResultsProps {
    value: string
    suggestedResults: SearchResult[]
    selectedSuggestedResult: SearchResult
    onSuggestedResultChange: (index: number) => void
    categorisedResults: CategorisedResults
    indexedResults: SearchResult[]
    selectedResult: SearchResult
    isSuggesting: boolean
    isEmpty: boolean
    onResultClick: () => void
    onResultChange: (index: number) => void
}

interface SearchEmptyProps {
    value: string
    isEmpty: boolean
    suggestedResults: SearchResult[]
    selectedResult: SearchResult
    onResultClick: () => void
    onResultChange: (index: number) => void
}

const SearchWrapper = styled.div`
    position: fixed;
    top: 0px;
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
        top: ${SEARCH_HEIGHT}px;
        left: 0px;
        width: 100%;
    }

    @media (min-width: ${desktop}) {
        width: calc(50% - 125px);
        max-width: 675px;
    }
`

const SearchInputWrapper = styled.div`
    position: relative;
    height: ${SEARCH_HEIGHT}px;
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
        width: 0px;
        height: 0px;
    }
    &::-ms-reveal {
        display: none;
        width: 0px;
        height: 0px;
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
    max-height: calc(100vh - ${SEARCH_HEIGHT}px);
    overflow-y: auto;
    background: #fff;
    box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.05);
    will-change: transform;
    z-index: -1;
`

const SearchResultsList = styled.ul`
    list-style: none;
`

const SearchSection = styled.li`
    padding: 32px;

    &:not(:last-of-type) {
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    }
`

const SearchEmptySection = styled(SearchSection)`
    position: sticky;
    top: 0px;
    display: flex;
    place-items: center;
    height: ${SEARCH_EMPTY_HEIGHT}px;
    background: #fff;
    padding-top: 0px;
    padding-bottom: 0px;
    z-index: 10;

    p {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 16px;
        font-weight: 500;
        margin-bottom: -3px;
        color: #aaa;

        span {
            color: #111;
        }
    }
`

const SearchSectionResults = styled.ul`
    list-style: none;
`

const SearchCategory = styled.div`
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

const SearchCategoryResults = styled.ul`
    list-style: none;
`

const SearchResultTitle = styled.h6`
    font-size: 16px;
    font-weight: 500;
    line-height: 1;
    padding: 6px 0px 6px 12px;
    margin: -4px -12px 0;
`

const SearchResultSecondaryTitle = styled.span`
    display: inline-block;
    vertical-align: bottom;
    max-width: 100%;
    font-weight: 400;
    opacity: 0.5;
`

const SearchResultDescription = styled.p`
    font-size: 15px;
    line-height: 1;
    padding: 6px 0px 6px 12px;
    margin: 0 -12px -8px;
    opacity: 0.7;
`

const SearchResultHighlight = styled.span`
    display: contents;
`

const SearchResultAnchor = styled.a`
    position: relative;
    display: grid;
    grid-gap: 12px;
    grid-template-columns: minmax(0, 1fr) max-content;
    color: inherit;
    z-index: 1;
    will-change: transform;

    ${SearchResultTitle},
    ${SearchResultDescription} {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    em {
        display: inline-block;
        position: relative;
        z-index: 1;

        &:before {
            content: "";
            position: absolute;
            top: -0.16em;
            bottom: 0.06em;
            left: -0.12em;
            right: -0.12em;
            z-index: -1;
            pointer-events: none;
            background: currentColor;
            opacity: 0.08;
            border-radius: 0.22em;
        }
    }
`

const SearchResultContainer = styled.li`
    position: relative;
    color: #111;

    &:before,
    ${SearchResultAnchor}:before {
        content: "";
        position: absolute;
        top: -16px;
        bottom: -16px;
        left: -16px;
        right: -16px;
        border-radius: 12px;
        z-index: 0;
    }

    &:not(:last-child) {
        margin-bottom: 32px;
    }

    &.library {
        em {
            color: var(--library);
        }

        &.active:before {
            background: var(--library);
        }
    }

    &.motion {
        em {
            color: var(--motion);
        }

        &.active:before {
            background: var(--motion);
        }
    }

    &.active {
        color: #fff;

        em {
            color: inherit;

            &:before {
                opacity: 0.2;
            }
        }
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

const SearchInputKey = styled(motion.button)`
    all: unset;
    color: #8a8a8a;
    background: #f5f5f5;
    padding: 4px 9px 2px;
    border-radius: 6px;
    font-weight: 500;
    font-size: 12px;
    position: absolute;
    top: 17px;
    right: 18px;
    cursor: pointer;
    transition-property: transform, background;
    transition-duration: 0.16s;
    will-change: transform;

    &:hover {
        background: #f0f0f0;
    }

    &:active {
        transform: scale(0.9);
    }
`

const ease: Transition = {
    ease: "easeInOut",
    duration: 0.2,
}

const spring: Transition = {
    type: "spring",
    stiffness: 500,
    damping: 50,
}

const transition: Transition = {
    default: spring,
    opacity: ease,
}

const variants: Variants = {
    visible: { opacity: 1 },
    hidden: {
        opacity: 0,
    },
}

const librarySuggestedResults: SearchResult[] = [
    {
        type: "property",
        library: "library",
        page: "Frame",
        title: "animate",
        secondaryTitle: "AnimationControls | TargetAndTransition | VariantLabels | boolean",
        description: "Values to animate to, variant label(s), or AnimationControls.",
        href: "/api/frame/#animationprops.animate",
    },
    {
        type: "property",
        library: "library",
        page: "Frame",
        title: "drag",
        secondaryTitle: 'boolean | "x" | "y"',
        description:
            'Enable dragging for this element. Set to false by default. Set true to drag in both directions. Set "x" or "y" to only drag in a specific direction.',
        href: "/api/frame/#draggableprops.drag",
    },
    {
        type: "page",
        library: "library",
        page: "Scroll",
        title: "Scroll",
        description: "Create scrollable areas for desktop or mobile, with mouse and touch-based input support.",
        href: "/api/scroll/",
    },
    {
        type: "page",
        library: "library",
        page: "Property Controls",
        title: "Property Controls",
        description: "Add controls to your components to allow customization via the Framer interface.",
        href: "/api/property-controls/",
    },
]

const motionSuggestedResults: SearchResult[] = [
    {
        type: "page",
        library: "motion",
        page: "Motion components",
        title: "Motion components",
        description: "Motion components are DOM primitives optimised for 60fps animation and gestures.",
        href: "/api/motion/component/",
    },
    {
        type: "page",
        library: "motion",
        page: "MotionValue",
        title: "MotionValue",
        description: "MotionValues track the state and velocity of animating values.",
        href: "/api/motion/motionvalue/",
    },
    {
        type: "subsection",
        library: "motion",
        page: "Animation",
        title: "Scale correction",
        secondaryTitle: "Layout animations",
        description:
            "All layout animations are performed using the transform property, resulting in smooth framerates.",
        href: "/api/motion/animation/#scale-correction",
    },
    {
        type: "function",
        library: "motion",
        page: "MotionValue",
        title: "useSpring",
        secondaryTitle: "MotionValue",
        tertiaryTitle: "source, config",
        description: "Creates a MotionValue that, when set, will use a spring animation to animate to its new state.",
        href: "/api/motion/motionvalue/#usespring",
    },
]

const consecutiveHighlightsRegex = /(<\/[^>]*>) *(<[^>]*>)/g
const categorySeparatorRegex = new RegExp(`^(.*)${CATEGORY_SEPARATOR}(.*)$`)

const getPage = () => {
    const title = document.title

    if (title.includes("|")) {
        const [, page] = title.match(/.* \| (.*)/) || [null, null]

        return page
    } else {
        return null
    }
}

const getCategory = (category: string) => {
    const [, library, page] = category.match(categorySeparatorRegex) || [null, null, null]

    return [library, page]
}

const flattenSearchResults = (categorisedResults: CategorisedResults): SearchResult[] => {
    return getDeepValues(categorisedResults)
}

const getHighlightResult = (result: SearchResult, property: Exclude<keyof SearchResult, "_highlightResult">) => {
    const isHighlightResult = "_highlightResult" in result
    const highlightResult = result._highlightResult?.[property]

    if (isHighlightResult) {
        return (
            <SearchResultHighlight
                dangerouslySetInnerHTML={{
                    __html: highlightResult?.value.replace(consecutiveHighlightsRegex, " ") as string,
                }}
            />
        )
    } else {
        return result[property]
    }
}

const SearchResult: FC<SearchResultProps> = memo(({ result, selectedResult, index, onResultChange, onResultClick }) => {
    const isActive = selectedResult === result
    const isMotion = result.library === "motion"

    const handleResultHover = useCallback(event => {
        const index = event.currentTarget.dataset.index

        onResultChange && onResultChange(index)
    }, [])

    return (
        <SearchResultContainer
            className={clsx(result.type, {
                active: isActive,
                motion: isMotion,
                library: !isMotion,
            })}
            onPointerEnter={handleResultHover}
            data-index={index}
        >
            <SearchResultAnchor onClick={onResultClick} href={result.href}>
                {result.type === "page" && (
                    <div>
                        <SearchResultTitle>
                            <SearchResultSecondaryTitle>
                                {getHighlightResult(result, "secondaryTitle")}
                            </SearchResultSecondaryTitle>
                            {getHighlightResult(result, "title")}
                        </SearchResultTitle>
                        <SearchResultDescription>{getHighlightResult(result, "description")}</SearchResultDescription>
                    </div>
                )}
                {result.type === "section" && (
                    <div>
                        <SearchResultTitle>{getHighlightResult(result, "title")}</SearchResultTitle>
                        <SearchResultDescription>{getHighlightResult(result, "description")}</SearchResultDescription>
                    </div>
                )}
                {result.type === "subsection" && (
                    <div>
                        <SearchResultTitle>
                            {result.secondaryTitle && (
                                <SearchResultSecondaryTitle>
                                    {getHighlightResult(result, "secondaryTitle")} ›
                                </SearchResultSecondaryTitle>
                            )}{" "}
                            {getHighlightResult(result, "title")}
                        </SearchResultTitle>
                        <SearchResultDescription>{getHighlightResult(result, "description")}</SearchResultDescription>
                    </div>
                )}
                {result.type === "property" && (
                    <div>
                        <SearchResultTitle>
                            {getHighlightResult(result, "title")}:{" "}
                            <SearchResultSecondaryTitle>
                                {getHighlightResult(result, "secondaryTitle")}
                            </SearchResultSecondaryTitle>
                        </SearchResultTitle>
                        <SearchResultDescription>{getHighlightResult(result, "description")}</SearchResultDescription>
                    </div>
                )}
                {result.type === "function" && (
                    <div>
                        <SearchResultTitle>
                            {getHighlightResult(result, "title")}({getHighlightResult(result, "tertiaryTitle")}
                            ):{" "}
                            <SearchResultSecondaryTitle>
                                {getHighlightResult(result, "secondaryTitle")}
                            </SearchResultSecondaryTitle>
                        </SearchResultTitle>
                        <SearchResultDescription>{getHighlightResult(result, "description")}</SearchResultDescription>
                    </div>
                )}
                {isActive && (
                    <SearchResultReturn>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14">
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
            </SearchResultAnchor>
        </SearchResultContainer>
    )
})

const SearchEmpty: FC<SearchEmptyProps> = ({
    value,
    isEmpty,
    suggestedResults,
    selectedResult,
    onResultChange,
    onResultClick,
}) => (
    <>
        {isEmpty && (
            <SearchEmptySection>
                <p>
                    No results for “<span>{value}</span>”.
                </p>
            </SearchEmptySection>
        )}
        <SearchSection>
            <SearchCategory>
                <h5>
                    <CategoryLogo library={isMotion() ? "motion" : "library"} height={10} />
                    <span>Suggestions</span>
                </h5>
                <SearchCategoryResults>
                    {suggestedResults.map((result, index) => {
                        return (
                            <SearchResult
                                key={index}
                                index={index}
                                result={result}
                                selectedResult={selectedResult}
                                onResultChange={onResultChange}
                                onResultClick={onResultClick}
                            />
                        )
                    })}
                </SearchCategoryResults>
            </SearchCategory>
        </SearchSection>
    </>
)

const SearchResults: FC<SearchResultsProps> = memo(
    ({
        value,
        categorisedResults,
        indexedResults,
        selectedResult,
        onResultChange,
        onResultClick,
        isSuggesting,
        isEmpty,
        suggestedResults,
        selectedSuggestedResult,
        onSuggestedResultChange,
    }) => {
        const categories = Object.entries(categorisedResults)

        return (
            <SearchResultsList>
                {isSuggesting ? (
                    <SearchEmpty
                        value={value}
                        isEmpty={isEmpty}
                        suggestedResults={suggestedResults}
                        selectedResult={selectedSuggestedResult}
                        onResultChange={onSuggestedResultChange}
                        onResultClick={onResultClick}
                    />
                ) : (
                    <SearchSection>
                        <SearchSectionResults>
                            {categories.map(([category, categoryResults], index) => {
                                const [library, page] = getCategory(category)

                                return (
                                    <SearchCategory key={index}>
                                        <h5>
                                            <CategoryLogo library={library as SearchResultLibrary} height={10} />
                                            <span>{page}</span>
                                        </h5>
                                        <SearchCategoryResults>
                                            {categoryResults.map((result, index) => {
                                                return (
                                                    <SearchResult
                                                        key={index}
                                                        index={indexedResults.findIndex(index => index === result)}
                                                        result={result}
                                                        selectedResult={selectedResult}
                                                        onResultChange={onResultChange}
                                                        onResultClick={onResultClick}
                                                    />
                                                )
                                            })}
                                        </SearchCategoryResults>
                                    </SearchCategory>
                                )
                            })}
                        </SearchSectionResults>
                    </SearchSection>
                )}
            </SearchResultsList>
        )
    }
)

const client = algoliasearch(process.env.ALGOLIA_PROJECT_ID as string, process.env.ALGOLIA_API_TOKEN as string)
const index = client.initIndex("prod_API")

const StaticSearch = () => {
    const inputRef = useRef<HTMLInputElement>(null)
    const wrapperRef = useRef<HTMLDivElement>(null)
    const [value, setValue] = useState("")
    const [isOpen, setOpen] = useState(false)
    const [results, setResults] = useState<SearchResult[] | null>(null)
    const categorisedResults = useMemo(() => {
        if (Array.isArray(results)) {
            return groupBy(
                results,
                result => `${result.library}${CATEGORY_SEPARATOR}${result.page}`
            ) as CategorisedResults
        } else {
            return {} as CategorisedResults
        }
    }, [results])
    const indexedResults = useMemo(() => flattenSearchResults(categorisedResults), [categorisedResults])
    const suggestedResults = useMemo(() => (isMotion() ? motionSuggestedResults : librarySuggestedResults), [])
    const [selectedResult, previousResult, nextResult, setResult] = useIndexItem(indexedResults)
    const [selectedSuggestedResult, previousSuggestedResult, nextSuggestedResult, setSuggestedResult] = useIndexItem(
        suggestedResults
    )
    const isSuggesting = useMemo(() => !results || results?.length === 0, [results])
    const isEmpty = useMemo(() => isSuggesting && Array.isArray(results), [isSuggesting, results])

    const search = useCallback(
        debounce((value: string) => {
            const page = getPage()
            const filters = [`library:${isMotion() ? "motion" : "library"}`]

            if (page) {
                filters.push(`page:${page}`)
            }

            index
                .search(value, {
                    hitsPerPage: 10,
                    removeStopWords: true,
                    optionalFilters: filters,
                    optionalWords: ["framer motion"],
                })
                .then(({ hits }) => {
                    setResults(hits as SearchResult[])
                })
                .catch(error => {
                    setResults([])

                    console.error(error)
                })
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
            setResults(null)

            search.cancel()
        }
    }, [])

    const handleFocus = useCallback(() => {
        setOpen(true)
    }, [])

    const handleClose = useCallback(() => {
        setOpen(false)
    }, [])

    const handleKey = useCallback(
        (event: KeyboardEvent) => {
            if (isOpen) {
                switch (event.key) {
                    case "ArrowUp":
                        event.preventDefault()

                        if (isSuggesting) {
                            previousSuggestedResult()
                        } else {
                            previousResult()
                        }

                        break
                    case "ArrowDown":
                        event.preventDefault()

                        if (isSuggesting) {
                            nextSuggestedResult()
                        } else {
                            nextResult()
                        }

                        break
                    case "Escape":
                        event.preventDefault()
                        setOpen(false)

                        break
                    case "Enter":
                        event.preventDefault()
                        setOpen(false)

                        if (isSuggesting) {
                            window.location.href = selectedSuggestedResult.href
                        } else {
                            window.location.href = selectedResult.href
                        }

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
        },
        [isOpen, isSuggesting, selectedResult, selectedSuggestedResult]
    )

    useClickOutside(wrapperRef, handleClose)

    useEffect(() => {
        if (isOpen) {
            inputRef.current && inputRef.current.focus()
            document.documentElement.setAttribute("data-scroll", "false")
            document.body.classList.add("is-search")
        } else {
            setResult(0)
            setSuggestedResult(0)

            inputRef.current && inputRef.current.blur()
            document.documentElement.removeAttribute("data-scroll")
            document.body.classList.remove("is-search")
        }
    }, [isOpen])

    useEffect(() => {
        if (isSuggesting) {
            setResult(0)
        } else {
            setSuggestedResult(0)
        }
    }, [isSuggesting])

    useEffect(() => {
        window.addEventListener("keydown", handleKey)

        return () => {
            window.removeEventListener("keydown", handleKey)
        }
    }, [handleKey])

    return (
        <SearchWrapper className="search">
            <SearchInputWrapper ref={wrapperRef}>
                <SearchInput
                    ref={inputRef}
                    value={value}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    type="search"
                    placeholder="Start typing to search…"
                />
                <AnimatePresence>
                    {isOpen && (
                        <SearchInputKey
                            key="escape"
                            onClick={handleClose}
                            variants={{
                                ...variants,
                                visible: {
                                    ...variants.visible,
                                    transition: {
                                        ...transition,
                                        delay: SEARCH_OPEN_DELAY,
                                    },
                                },
                            }}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            transition={transition}
                        >
                            esc
                        </SearchInputKey>
                    )}
                </AnimatePresence>
                <AnimatePresence>
                    {isOpen && (
                        <SearchResultsDropdown
                            key="dropdown"
                            variants={{
                                hidden: {
                                    ...variants.hidden,
                                    y: -SEARCH_HEIGHT,
                                },
                                visible: {
                                    ...variants.visible,
                                    y: 0,
                                    transition: {
                                        ...transition,
                                        delay: SEARCH_OPEN_DELAY,
                                    },
                                },
                            }}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            transition={transition}
                        >
                            <SearchResults
                                value={value}
                                suggestedResults={suggestedResults}
                                categorisedResults={categorisedResults}
                                indexedResults={indexedResults}
                                selectedResult={selectedResult}
                                selectedSuggestedResult={selectedSuggestedResult}
                                onSuggestedResultChange={setSuggestedResult}
                                onResultChange={setResult}
                                onResultClick={handleClose}
                                isSuggesting={isSuggesting}
                                isEmpty={isEmpty}
                            />
                        </SearchResultsDropdown>
                    )}
                </AnimatePresence>
            </SearchInputWrapper>
        </SearchWrapper>
    )
}

export const Search = Dynamic(StaticSearch)
