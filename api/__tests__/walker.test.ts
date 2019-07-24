import { resolve } from "path"
import { ApiModel, ReleaseTag } from "@microsoft/api-extractor-model"
import { walk } from "../walker"

describe("walk", () => {
    function createApiPackage() {
        return new ApiModel().loadPackage(resolve(__dirname + "/../__fixtures__/example.api.json"))
    }

    it("should generate ids", () => {
        const ids: string[] = []
        const pkg = createApiPackage()
        walk(pkg.entryPoints[0], ReleaseTag.Public, item => ids.push(item.id))
        expect(ids.sort()).toMatchSnapshot()
    })
})
