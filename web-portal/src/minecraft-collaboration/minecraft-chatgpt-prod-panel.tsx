import { Button } from "@mui/material";
import { RequestStatus, useChatGPTCollaboration } from "../chatgpt/chatgpt-hooks";
import TextDisplay from "../chatgpt/text-display";
import { StyledCard, StyledCardHeader } from "../page/styled-components";
import { MinecraftStructure, MinecraftWorldAgent } from "../types/minecraft";
import { MinecraftWorldState, MinecraftWorldActions } from "./hooks";
import { PROMPT_TEXT } from "./prompt";

import StatusComp from "../page/status-comp";
import styled from "@emotion/styled";
import { useChatGPTStrcutureDescription, buildMinecraftStructureText, parseGPTCommand } from "../chatgpt/chatgpt-hooks";
import { PromptCheckpoint } from "../types/prompt";
import { MinecraftTaskAgentSpec } from "../types/task";
import { useEffect } from "react";
import { AgentAutoMeta } from "./auto-control/hooks";
import { assemblePrompt } from "./prompts/utils";
import { CONTEXTUAL_PROMPT } from "./prompts/context";
import MinecraftAgentControl from "./minecraft-agent-control";

interface MinecraftChatGPTPanelProps {
    sessionId: string,
    blueprint: MinecraftStructure,
    minecraftWorldState: MinecraftWorldState,
    minecraftWorldActions: MinecraftWorldActions,
    promptCheckpoint: PromptCheckpoint | undefined,
    agent: MinecraftWorldAgent,
    agentConfig: MinecraftTaskAgentSpec,
    registerAutoExecution: (autoExecution: AgentAutoMeta, index: number) => void,
    agentIndex: number,
    updateFetchResult: (result: string, status: RequestStatus, index: number) => void,
    logChatGPT?: (messages: Array<String>, response: string) => void | undefined,
    initializedRecordId: string,
    postProcess: () => void
    // onExternalFetch: () => void,
    // onFetched: () => void,
    // onExternalApply: () => void,
}

const ControlRow = styled("div")({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 8,
})

const TextDisplayRow = styled("div")({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginBottom: 8,
})


const CardContent = styled("div")({
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    marginRight: 12,
    marginLeft: 12,
    alignItems: "stretch",
})



export default function MinecraftChatGPTProdPanel({ sessionId, blueprint, minecraftWorldState, minecraftWorldActions, promptCheckpoint, agent, agentConfig, registerAutoExecution, agentIndex, updateFetchResult, logChatGPT, initializedRecordId, postProcess}: MinecraftChatGPTPanelProps) {

    // const prompt = PROMPT_TEXT + "\n" + `In the dialogue, your id is ${agent.name} when your partner has a different id.\n` + promptCheckpoint?.promptMessage;

    const prompt = assemblePrompt(
        CONTEXTUAL_PROMPT, promptCheckpoint?.promptMessage || "EMPTY EXAMPLE", `======================================================
        You do not worry about the implementation of the commands as we will input them to Minecraft by our mod. Just follow the ways I showed. Now, if you understand the whole process, I will provide a new scenario for you do the task.
        In the dialogue, your id is ${agent.name} when your partner has a different id.\n`
    )

    let agentControlProps = minecraftWorldActions.generateAgentControlProps(agent.name);
    const { result, status, messageHistory, oneTimeRun, oneTimeRunAsync, latestRequest, latestResponse } = useChatGPTCollaboration(blueprint, minecraftWorldActions, agentControlProps.state, prompt, false, agentConfig, logChatGPT);
    let action = parseGPTCommand(`place_block(block_type="yellow", pos=(0, 2, 2))`, agent);
    action = parseGPTCommand(`send_message(message="You placed the red block at (1, 2, 1), but it should be at (1, 3, 0). Please remove the red block at (1, 2, 1) and place it at (1, 3, 0)")`, agent);
    let lines = result.split("\n");

    const applyCommands = (text: string) => {
        for (let line of text.split("\n")) {
            let action = parseGPTCommand(line, agent);
            if (action) {
                minecraftWorldActions.addAgentAction(action);
            }
        }
    }

    useEffect(() => {
        updateFetchResult(result, status, agentIndex);

    }, [result, status])



    useEffect(() => {
        // registerAutoExecution({
        //     sessionId: sessionId,
        //     fetchAction: oneTimeRun,
        //     result: result,
        //     fetchStatus: status,
        //     postAction: (text: string) => {
        //         applyCommands(text);
        //     },
        //     index: agentIndex
        // }, agentIndex);
    }, [])

    const onSubmitFeedback = (feedback: string, isSuccess: boolean) => {
        const formData = new FormData();
        formData.append("session_id", sessionId);
        formData.append("record", initializedRecordId);
        formData.append("content", `${isSuccess?"Task completed": "Task incompleted"} \n` + feedback);
        formData.append("spec", JSON.stringify(agentConfig));
        return fetch("/api/feedback/", {
            method: "POST",
            body: formData
        }).then (res => {
            return res;
        });
    }


    return (
        <StyledCard
            sx={{
                paddingBottom: 18,
            }}
        >
            <StyledCardHeader title={"Batch Control"} titleTypographyProps={{ variant: "h6" }}
                action={(<StatusComp
                    status={status}
                />)}
            ></StyledCardHeader>
            <CardContent>
                {/* <ControlRow>
                    <StatusComp
                        status={status}
                    />
                </ControlRow> */}
                <MinecraftAgentControl
                    actions={minecraftWorldActions.getAgentCurrentActionBatch(minecraftWorldState.agents[0].name)}
                    onSubmit={async () => {
                        return oneTimeRunAsync().then((r) => {
                            if (r[0]) {
                                applyCommands(r[1]);
                                
                                postProcess();
                            }
                        });
                    }}
                    onSubmitFeedback={onSubmitFeedback}
                />
                {/* <TextDisplay
                    text={prompt}
                /> */}
                {/* <TextDisplayRow>
                    <TextDisplay
                        sx={{ marginRight: 4 }}
                        title="Request"
                        text={latestRequest}
                    />
                    <TextDisplay
                        title="Response"
                        text={latestResponse}
                    />
                </TextDisplayRow> */}

            </CardContent>

        </StyledCard>
    )
}
