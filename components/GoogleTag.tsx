import * as React from "react"
import { RawScript } from "./RawScript"

type Props = {
    analyticsId: string
}

export const GoogleTag = ({ analyticsId }: Props) => (
    <>
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${analyticsId}`}></script>
        <RawScript>{`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', "${analyticsId}");`}
        </RawScript>
  </>
)
