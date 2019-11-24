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

const SearchResults = styled.div`
    background: #fff;
    position: absolute;
    overflow-y: auto;
    top: 58px;
    width: 100%;
    height: calc(100vh - 58px);
    visibility: hidden;
`

export const Search: React.FunctionComponent = () => (
    <SearchWrapper className="search">
        <SearchInput type="search" placeholder="Search..." />
        <SearchResults className="search-results"></SearchResults>
    </SearchWrapper>
)
