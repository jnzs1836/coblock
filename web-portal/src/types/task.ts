import { MinecraftBlock, MinecraftBlueprint, MinecraftWorldAgentInventoryBlockState } from "./minecraft";
import { PromptCheckpoint } from "./prompt";


enum TaskWorkLoadType {
    Equal = "equal",
    Unequal = "unequal",
}
enum TaskMotiveType {
    Parallel = "parallel",
    Weakly = "weakly",
    Strongly = "strongly",
    Dependent = "dependent",
    Cognitvie = "cognitive",
}

enum TaskSkillsetType {
    Sychronous = "sychronous",
    Asynchronous = "asynchronous",
}

interface MinecraftTaskSpec {
    workLoadType: TaskWorkLoadType,
    motiveType: TaskMotiveType,
    skillsetType: TaskSkillsetType,
}

enum MinecraftTaskAgentView {
    View3D = "3D",
    View2DFront = "2D-front",
    View2DTop = "2D-top",
    View2DLeft = "2D-left",
    View2DRight = "2D-right",
    View2DBottom = "2D-bottom",
    View2DBehind = "2D-behind",
}
interface MinecraftTaskAgentSpec {
    role: string,
    name: string,
    inventory: MinecraftWorldAgentInventoryBlockState[],
    views: MinecraftTaskAgentView[],
    blueprint: MinecraftBlueprint | undefined,
    motives: StructureMotiveInstance[],
}

interface MinecraftTaskInstance {
    id: string,
    spec: MinecraftTaskSpec,
    blueprints: MinecraftBlueprint[],
    agents: MinecraftTaskAgentSpec[],
    promptCheckpoint?: PromptCheckpoint,
    baseBlueprint: MinecraftBlueprint | undefined,
}

interface MinecraftTaskAnnotation {
    involvedAbilities: string[],
    taskType: string,
}

interface MinecraftCollaborationSession {
    blueprint: MinecraftBlueprint,
    id: string,
    config: MinecraftTaskInstance 
}

interface MotiveDescription {
    descriptionType: string;
}

interface MotiveVisualDescription extends MotiveDescription {
    readonly descriptionType: "VISUAL";
    blocks: MinecraftBlock[];
    views: MinecraftTaskAgentView[],
}

interface MotiveTextualDescription extends MotiveDescription {
    readonly descriptionType: "TEXTUAL";
    text: string;
}


enum MotiveDetailLevel {
    VISUAL = "VISUAL",
    FINE_DESCRIPTION = "FINE_DESCRIPTION",
    COARSE_DESCRIPTION = "COARSE_DESCRIPTION",
}

interface StructureMotiveConfig {
    blockIndices: number[],
    detailLevel: MotiveDetailLevel 
}

interface StructureMotiveInstance {
    name: string,
    config: StructureMotiveConfig,
    description: MotiveVisualDescription | MotiveTextualDescription,
    hint?: string,
}

export { TaskWorkLoadType, TaskMotiveType, TaskSkillsetType, MinecraftTaskAgentView, MotiveDetailLevel };

export type { MinecraftTaskInstance, MinecraftTaskAgentSpec, MinecraftTaskSpec, MinecraftCollaborationSession, StructureMotiveConfig, StructureMotiveInstance, MotiveTextualDescription, MotiveVisualDescription };