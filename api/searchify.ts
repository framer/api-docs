import glob from "glob"
import { promises as fs } from "fs"
import { chromium } from "playwright"

const parseAPI = async (files: string[] = []) => {
    const browser = await chromium.launch()
    const context = await browser.newContext()
    const page = await context.newPage()
    const data = []

    for (const file of files) {
        const content = await fs.readFile(file, "utf8")
        await page.setContent(content)
        await page.waitForLoadState()

        const pageData = await page.evaluate((file: string) => {
            const toArray = (list: NodeList | HTMLCollection) => {
                return list ? Array.from(list) : []
            }

            const getPageURL = (file: string) => {
                const page = file.replace("./build/", "").replace("index.html", "")

                return `/api/${page}`
            }

            const getPageLibrary = (file: string) => {
                const isMotion = file.includes("/motion")

                return isMotion ? "motion" : "library"
            }

            const getPreviousSibling = (element: Element, selector: string) => {
                let sibling = element.previousElementSibling
                if (!selector) return sibling

                while (sibling) {
                    if (sibling.matches(selector)) return sibling

                    sibling = sibling.previousElementSibling
                }
            }

            const sanitizeInnerHTML = (innerHTML = "") => {
                return innerHTML.replace(/\w+="[^"]+"/g, "").replace(/(<\w+)\s+(>)/g, "$1$2")
            }

            const getTextContent = (element: Element | null) => {
                if (!element) return undefined

                const childNodes = element ? toArray(element.childNodes) : []

                const textContent = childNodes.map(childNode => {
                    const isTextNode = childNode.nodeType === Node.TEXT_NODE
                    const nodeValue = (childNode.nodeValue || "").trim()

                    return isTextNode && nodeValue ? nodeValue : ""
                })

                return textContent.join("")
            }

            const parsePermalink = (element: Element | null) => {
                if (!element) return [undefined, undefined]

                const textContent = getTextContent(element)

                const permalinkElement = element.querySelector("[data-permalink-path]")
                const permalink = permalinkElement ? permalinkElement.getAttribute("data-permalink-path") : undefined

                return [textContent, permalink]
            }

            const parsePropertyPermalink = (element: Element | null) => {
                if (!element) return [undefined, undefined]

                const code = element.querySelector("code")
                const textContent = code
                    ? sanitizeInnerHTML(code.innerHTML)
                    : (getTextContent(element) as string).slice(0, -1)

                const permalinkElement = element.querySelector("[data-permalink-path]")
                const permalink = permalinkElement ? permalinkElement.getAttribute("data-permalink-path") : undefined

                const additionalElement = element.querySelector(".addition")
                const addition = additionalElement ? (additionalElement.textContent || "").trim() : undefined

                return [textContent, addition, permalink]
            }

            const data = []

            /*
             * Pages
             */
            const pageURL = getPageURL(file)
            const pageLibrary = getPageLibrary(file)
            const [pageTitle] = parsePermalink(document.querySelector("h1"))
            const pageDescription = document.querySelector("h1 + span")

            data.push({
                type: "page",
                library: pageLibrary,
                page: pageTitle,
                title: pageTitle,
                description: pageDescription ? sanitizeInnerHTML(pageDescription.innerHTML) : undefined,
                href: pageURL,
            })

            /*
             * Sections
             */
            const sections = toArray(document.querySelectorAll(".grid-section-h2"))

            for (const section of sections as Element[]) {
                const [title, permalink] = parsePermalink(section.querySelector("h2"))
                const description = section.querySelector("p")

                if (permalink && description) {
                    data.push({
                        type: "section",
                        library: pageLibrary,
                        page: pageTitle,
                        title: title,
                        description: sanitizeInnerHTML(description.innerHTML),
                        href: permalink,
                    })
                }
            }

            /*
             * Subsections
             */
            const subsections = toArray(document.querySelectorAll(".grid-section-h3"))

            for (const subsection of subsections as Element[]) {
                const titleElement = subsection.querySelector("h3")
                const [title, permalink] = parsePermalink(titleElement)
                const description = titleElement ? titleElement.nextElementSibling : undefined

                const parentContainer = getPreviousSibling(subsection, ".grid-section-h1, .grid-section-h2")
                let parent: string | undefined

                if (parentContainer) {
                    const parentSelector = parentContainer.classList.contains(".grid-section-h1") ? "h1" : "h2"
                    const parentElement = parentContainer.querySelector(parentSelector)
                    parent = getTextContent(parentElement)
                }

                if (permalink && description) {
                    data.push({
                        type: "subsection",
                        library: pageLibrary,
                        page: pageTitle,
                        title: title,
                        secondaryTitle: parent,
                        description: sanitizeInnerHTML(description.innerHTML),
                        href: permalink,
                    })
                }
            }

            /*
             * Properties
             */
            const properties = toArray(document.querySelectorAll(".framer-variable, .framer-method, .framer-property"))

            for (const property of properties as Element[]) {
                const [title, secondaryTitle, permalink] = parsePropertyPermalink(property.querySelector("h3"))
                const description = property.querySelector("[data-tsdoc-ref] > p")

                if (permalink && description) {
                    data.push({
                        type: "property",
                        library: pageLibrary,
                        page: pageTitle,
                        title: title,
                        secondaryTitle: secondaryTitle,
                        description: sanitizeInnerHTML(description.innerHTML),
                        href: permalink,
                    })
                }
            }

            return Promise.resolve(data)
        }, file)

        data.push(pageData)
    }

    await browser.close()
    return data
}

const PATH = "./build/"

glob(
    `${PATH}/**/*.html`,
    {
        ignore: [
            `${PATH}/**/404.html`,
            `${PATH}/**/404/*`,
            `${PATH}/index.html`,
            `${PATH}/animation-deprecated/*`,
            `${PATH}/changelog/*`,
            `${PATH}/debug/*`,
            `${PATH}/examples/*`,
            `${PATH}/frame-deprecated/*`,
            `${PATH}/tutorial/*`,
            `${PATH}/motion/index.html`,
            `${PATH}/motion/examples/*`,
        ],
    },
    async (_, files) => {
        const data = await parseAPI(files)

        console.log(data)
    }
)
