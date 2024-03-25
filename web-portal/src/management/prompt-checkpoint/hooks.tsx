import { useState } from "react"
import { PromptCheckpoint, convertResponseToPrompCheckpoint } from "../../types/prompt";
import { useGetAPI, useGetListAPI } from "../../web/hooks";
import { updatePromptCheckpointAPI } from "./api";
import { useAuthHeader } from "react-auth-kit";


const usePromptCheckpointList = () => {

    return useGetListAPI<PromptCheckpoint>("/api/prompts/", true, (res: any) => {
        return convertResponseToPrompCheckpoint(res) as PromptCheckpoint;
    }
    );
}

const usePromptCheckpointEdit = (promptId: string) => {

    const authHeader = useAuthHeader();


    const {
        result: prompt,
        
        updateDataClientSide: updatePromptCheckpoint,
    } = useGetAPI<PromptCheckpoint>(
        `/api/prompts/${promptId}/`,
        true,
        (res: any) => {
            return {
                ...res,
                tags: res.tags.map((tag: any) => tag.name),
                messagePrefix: res.message_prefix,
                messageSuffix: res.message_suffix,
                promptMessage: res.prompt_message,
            } as PromptCheckpoint;
        }
    )

    const onSave = () => {
        if (prompt) {
            return updatePromptCheckpointAPI(prompt, authHeader());
        }else{
            return Promise.reject("No prompt to save");
        }
    }

    // const [prompt, setPrompt] = useState<PromptCheckpoint>({
    //     id: "",
    //     name: "",
    //     messagePrefix: "",
    //     messageSuffix: "",
    //     promptMessage: "",
    //     version: "",
    //     tags: [],
    // });
    return {promptCheckpoint: prompt, updatePromptCheckpoint, onSave}

}

export { usePromptCheckpointList, usePromptCheckpointEdit }