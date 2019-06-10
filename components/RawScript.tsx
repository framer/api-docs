import * as React from "react"

export class RawScript extends React.Component {
    private count = 0

    render() {
        this.count++

        // Never render twice, or the scripts will get attached multiple times
        // this should not occur if you just keep this in <head>.
        if (this.count > 1) {
            throw Error("<RawScript> is rendering more than once")
        }

        const { children } = this.props

        if (typeof children !== "string") {
            throw Error("<RawScript> expects children to be a string")
        }

        return <script dangerouslySetInnerHTML={{ __html: children }} />
    }
}
