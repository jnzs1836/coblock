import { PromptCheckpoint } from "../../types/prompt";

export function createNewPromptCheckpoint(promptCheckpoint: PromptCheckpoint,
        authContent: string
    ) {
    let formData = new FormData();
    formData.append('name', promptCheckpoint.name);
    formData.append('prompt_message', promptCheckpoint.promptMessage);
    formData.append('message_prefix', promptCheckpoint.messagePrefix);
    formData.append('message_suffix', promptCheckpoint.messageSuffix);
    formData.append('version', promptCheckpoint.version);
    formData.append('tag_count', promptCheckpoint.tags.length.toString());
    promptCheckpoint.tags.forEach((tag, index) => {
        formData.append(`tag_${index}`, tag);
    });

    return fetch('/api/prompts/', {
        method: 'POST',
        headers: {
            'Authorization': authContent,
        },
        body: formData,
    });
}

export function updatePromptCheckpointAPI(promptCheckpoint: PromptCheckpoint,
    authContent: string
) {
    let formData = new FormData();
    formData.append('name', promptCheckpoint.name);
    formData.append('prompt_message', promptCheckpoint.promptMessage);
    formData.append('message_prefix', promptCheckpoint.messagePrefix);
    formData.append('message_suffix', promptCheckpoint.messageSuffix);
    formData.append('version', promptCheckpoint.version);
    formData.append('tag_count', promptCheckpoint.tags.length.toString());
    promptCheckpoint.tags.forEach((tag, index) => {
        formData.append(`tag_${index}`, tag);
    });

    return fetch(`/api/prompts/${promptCheckpoint.id}/`, {
        method: 'PUT',
        headers: {
            'Authorization': authContent,
        },
        body: formData,
    });
}

export function deletePromptCheckpointAPI(promptCheckpointId: string,
    authContent: string
) {
    return fetch(`/api/prompts/${promptCheckpointId}/`, {
        method: 'DELETE',
        headers: {
            'Authorization': authContent,
        },
    });
}