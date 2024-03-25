import React, { useState } from "react";
import { PromptCheckpoint } from "../../types/prompt";
import {
    TextField,
    Button,
    Checkbox,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import PromptTagInput from "./prompt-tag-input";
import { usePromptCheckpointEdit } from "./hooks";
import { useRequestWrapper } from "../../web/hooks";
import LoadingProgress from "../../page/loading-progress";

const PromptEditorContainer = styled("div")({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
    padding: "16px",
    backgroundColor: "#f2f2f2",
});

const PromptEditorForm = styled("form")({
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    width: "480px",
});

interface Props {
    promptCheckpoint: PromptCheckpoint;
    setPrompt: React.Dispatch<React.SetStateAction<PromptCheckpoint | undefined>>;
    onSave: () => Promise<any>;
}

const PromptEditor = ({ promptCheckpoint, setPrompt, onSave }: Props) => {
    //   const [prompt, setPrompt] = useState<PromptCheckpoint>({
    //     id: "",
    //     name: "",
    //     messagePrefix: "",
    //     messageSuffix: "",
    //     promptMessage: "",
    //     version: "",
    //     tags: [],
    //   });

    const {
        wrappedRequestFunc: onSaveWrapped,
        status: onSaveStatus,
    } = useRequestWrapper(onSave, true);

    const handlePromptMessageChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setPrompt((prevState) => {
            if (!prevState) {
                return undefined;
            }
            return {
                ...prevState,
                promptMessage: event.target.value,
            }
        });
    };

    const handleVersionChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setPrompt((prevState) => {
            if (!prevState) {
                return undefined;
            }
            return {
                ...prevState,
                version: event.target.value,
            }
        });
    };

    const handleTagChange = (event: React.ChangeEvent<{ value: unknown }>) => {

        setPrompt((prevState) => {
            if (!prevState) {
                return undefined;
            }
            return {
                ...prevState,
                tag: event.target.value as string[],
            }
        });
    };

    const handleNameChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setPrompt((prevState) => {
            if (!prevState) {
                return undefined;
            }
            return {
                ...prevState,
                name: event.target.value as string,
            }
        });
    };

    const handleMessagePrefixChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setPrompt((prevState) => {
            if (!prevState) {
                return undefined;
            }
            return {
                ...prevState,
                messagePrefix: event.target.value,
            }
        });
    };

    const handleMessageSuffixChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setPrompt((prevState) => {
            if (!prevState) {
                return undefined;
            }
            return {
                ...prevState,
                messageSuffix: event.target.value,
            }
        });
    };



    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSaveWrapped();
    };

    return (
        <PromptEditorContainer>
            <PromptEditorForm onSubmit={handleSubmit}>
                <TextField
                    label="ID"
                    variant="outlined"
                    value={promptCheckpoint.id}
                    disabled
                />
                <TextField
                    label="Prompt Name"
                    variant="outlined"
                    value={promptCheckpoint.name}
                    onChange={handleNameChange}
                    fullWidth
                />
                <TextField
                    label="Prompt Message"
                    variant="outlined"
                    value={promptCheckpoint.promptMessage}
                    onChange={handlePromptMessageChange}
                    fullWidth
                    multiline
                    rows={4}
                />
                <TextField
                    label="Message Prefix"
                    variant="outlined"
                    value={promptCheckpoint.messagePrefix}
                    onChange={handleMessagePrefixChange}
                    fullWidth
                    multiline
                    rows={4}
                />
                <TextField
                    label="Message Suffix"
                    variant="outlined"
                    value={promptCheckpoint.messageSuffix}
                    onChange={handleMessageSuffixChange}
                    fullWidth
                    multiline
                    rows={4}
                />
                <TextField
                    label="Version"
                    variant="outlined"
                    value={promptCheckpoint.version}
                    onChange={handleVersionChange}
                />
                <PromptTagInput
                    tags={promptCheckpoint.tags}
                    onChange={(tags) => setPrompt((prevState) => {
                        if (!prevState) {
                            return undefined;
                        }
                        return {
                            ...prevState,
                            tags: tags,
                        }
                    })}
                />
                <Button variant="contained" color="primary" type="submit">
                    Save
                </Button>
                <LoadingProgress
                    status={onSaveStatus}
                    errorMessage="Failed to save prompt."
                    successMessage="Prompt saved!"
                />
            </PromptEditorForm>
        </PromptEditorContainer>
    );
};

export default PromptEditor;
