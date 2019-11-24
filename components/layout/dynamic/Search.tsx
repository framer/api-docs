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
    padding: 15px 20px;
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
