import { PromptCheckpoint } from "./prompt";
import { MinecraftCollaborationSession } from "./task";

export type Batch = {
    name: string;
    backendVersion: string;
    sessionIndices: string[];
    promptCheckpoint: PromptCheckpoint | undefined;
}
