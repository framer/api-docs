import * as json from "../__fixtures__/example.api.json"
import { ApiPackage, ApiItem, ReleaseTag } from "@microsoft/api-extractor-model"
import { walk } from "../walker"

describe("walk", () => {
    function createApiPackage() {
        return ApiItem.deserialize(json as any) as ApiPackage
    }

    it("should generate ids", () => {
        const ids: string[] = []
        const pkg = createApiPackage()
        walk(pkg.entryPoints[0], ReleaseTag.Public, item => ids.push(item.id))
        expect(ids).toMatchSnapshot()
    })
})
