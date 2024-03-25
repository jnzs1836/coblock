const assemblePrompt = (contextualPrompt: string, demonstrationPromp: string, lastPrompt: string) => {
    return `${contextualPrompt}\n${demonstrationPromp}\n${lastPrompt}`;
}

export {assemblePrompt}