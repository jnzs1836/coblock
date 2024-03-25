import { MinecraftStructure } from "../types/minecraft";
import {MinecraftTaskAgentView} from "../types/task";
import {BlueprintPartialView} from "../types/blueprint";


function generatePartialView (blueprintStructure: MinecraftStructure, view: MinecraftTaskAgentView ): BlueprintPartialView {
    return {
        view: view,
        blocks: blueprintStructure.blocks
    }
}

