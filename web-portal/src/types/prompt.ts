
interface PromptCheckpoint {
    id: string;
    name: string;
    promptMessage: string;
    messagePrefix: string;
    messageSuffix: string;
    version: string;
    tags: string[];
};

const defaultPromptCheckpoint: PromptCheckpoint = {
    id: "-1",
    name: "Default Prompt Checkpoint",
    promptMessage: "",
    messagePrefix: "",
    messageSuffix: "",
    version: "",
    tags: [],
}

function convertResponseToPrompCheckpoint(response: any){
    return {
        id: response.id,
        name: response.name,
        promptMessage: response.prompt_message,
        messagePrefix: response.message_prefix,
        messageSuffix: response.message_suffix,
        version: response.version,
        tags: response.tags,
    }
}

export type {PromptCheckpoint};

export {defaultPromptCheckpoint, convertResponseToPrompCheckpoint};
