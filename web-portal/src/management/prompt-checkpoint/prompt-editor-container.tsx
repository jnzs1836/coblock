import PromptEditor from "./prompt-editor";
import { usePromptCheckpointEdit } from "./hooks";
import React, { Dispatch } from "react";


interface Props {
    promptId: string
}
export default function PromptEditorContainer({promptId}: Props){
    const {
        promptCheckpoint, updatePromptCheckpoint: setPrompt, onSave
    } = usePromptCheckpointEdit(promptId)

    

        return (
        <div>
            {promptCheckpoint && <PromptEditor 
            onSave={onSave}
            promptCheckpoint={promptCheckpoint} setPrompt={setPrompt}/>}
        </div>
    )

}