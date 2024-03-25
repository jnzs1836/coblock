import { MinecraftBlock } from "./minecraft"
import { MinecraftTaskAgentView } from "./task"

interface BlueprintPartialView {
    view: MinecraftTaskAgentView,
    blocks: MinecraftBlock[]
}
export type {BlueprintPartialView}