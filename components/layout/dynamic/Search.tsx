import * as React from "react"
import styled from "styled-components"
import { desktop, tablet, mobile } from "../Breakpoints"

const SearchWrapper = styled.div`
    position: absolute;
    top: 58px;
    left: 0;
    width: 100vw;
    height: 58px;
    background: #fff;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    z-index: 2000;

    &:focus-within {
        position: fixed;

        .search-results {
            visibility: visible;
        }
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

const SearchResults = styled.ul`
    background: #fff;
    position: absolute;
    overflow-y: auto;
    top: 58px;
    width: 100%;
    height: calc(100vh - 58px);
    padding: 20px 26px;
    list-style: none;
    visibility: hidden;
`

const SearchGroup = styled.li`
    &:not(:last-child) {
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

const SearchGroupResults = styled.ul`
    list-style: none;
`

const SearchResult = styled.li`
    a {
        color: #111;
        transition: color 0.12s ease-in-out;

        &:hover {
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

export const Search: React.FunctionComponent = () => (
    <SearchWrapper className="search">
        <SearchInput type="search" placeholder="Search..." />
        <SearchResults className="search-results">
            <SearchGroup>
                <h5>Recently viewed</h5>
                <SearchGroupResults>
                    <SearchResult>
                        <a href="#">
                            <h6>
                                Width: <span>number | string | MotionValue</span>
                            </h6>
                            <p>
                                Set the CSS width property. Set to 200 by default. Accepts all CSS value types
                                (including pixels, percentages, keywords and more).
                            </p>
                        </a>
                    </SearchResult>
                    <SearchResult>
                        <a href="#">
                            <h6>
                                Width: <span>number | string | MotionValue</span>
                            </h6>
                            <p>
                                Set the CSS width property. Set to 200 by default. Accepts all CSS value types
                                (including pixels, percentages, keywords and more).
                            </p>
                        </a>
                    </SearchResult>
                </SearchGroupResults>
            </SearchGroup>
            <SearchGroup>
                <h5>Frame</h5>
                <SearchGroupResults>
                    <SearchResult>
                        <a href="#">
                            <h6>
                                Width: <span>number | string | MotionValue</span>
                            </h6>
                            <p>
                                Set the CSS width property. Set to 200 by default. Accepts all CSS value types
                                (including pixels, percentages, keywords and more).
                            </p>
                        </a>
                    </SearchResult>
                    <SearchResult>
                        <a href="#">
                            <h6>
                                Width: <span>number | string | MotionValue</span>
                            </h6>
                            <p>
                                Set the CSS width property. Set to 200 by default. Accepts all CSS value types
                                (including pixels, percentages, keywords and more).
                            </p>
                        </a>
                    </SearchResult>
                    <SearchResult>
                        <a href="#">
                            <h6>
                                Width: <span>number | string | MotionValue</span>
                            </h6>
                            <p>
                                Set the CSS width property. Set to 200 by default. Accepts all CSS value types
                                (including pixels, percentages, keywords and more).
                            </p>
                        </a>
                    </SearchResult>
                </SearchGroupResults>
            </SearchGroup>
        </SearchResults>
    </SearchWrapper>
)
