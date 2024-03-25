import { Button } from "@mui/material";
import { RequestStatus, useChatGPTCollaboration } from "../chatgpt/chatgpt-hooks";
import TextDisplay from "../chatgpt/text-display";
import { StyledCard, StyledCardHeader } from "../page/styled-components";
import { MinecraftStructure, MinecraftWorldAgent, MinecraftWorldAgentAction } from "../types/minecraft";
import { MinecraftWorldState, MinecraftWorldActions, MinecraftWorldAgentMessageAction, MinecraftWorldAgentPlaceAction, MinecraftWorldAgentBreakAction, MinecraftWorldAgentEndAction } from "./hooks";
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
import { MinecraftWorldAgentActionResponse, MinecraftWorldAgentNullAction } from "../types/agent";
import { getBreakActionResponse, getEndSessionActionResponse, getMessageActionResponse, getNullActionResponse, getPlaceActionResponse } from "./utils/action-response";
import { ExperimentType } from "../bi-agent/types";
import { validCurrentStructure } from "./utils/validation";

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
    postProcess: () => void,
    currentTurn: number,
    experimentType?: ExperimentType,
    onSubmitFeedback: (feedback: string, isSuccess: boolean) => Promise<Response>;
    backendVersion: string,
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



export default function MinecraftChatGPTSyncPanel({ sessionId, blueprint, minecraftWorldState, minecraftWorldActions, promptCheckpoint, agent, agentConfig, registerAutoExecution, agentIndex, updateFetchResult, logChatGPT, initializedRecordId, postProcess, currentTurn, experimentType, onSubmitFeedback, backendVersion }: MinecraftChatGPTPanelProps) {
    const validExperimentType = experimentType ? experimentType : ExperimentType.Individual;

    let allowFailure = minecraftWorldState.agentActions.length > 6 ? true : false;
    // const prompt = PROMPT_TEXT + "\n" + `In the dialogue, your id is ${agent.name} when your partner has a different id.\n` + promptCheckpoint?.promptMessage;

    const prompt = assemblePrompt(
        CONTEXTUAL_PROMPT, promptCheckpoint?.promptMessage || "EMPTY EXAMPLE", `======================================================
        You do not worry about the implementation of the commands as we will input them to Minecraft by our mod. Just follow the ways I showed. Now, if you understand the whole process, I will provide a new scenario for you do the task.
        In the dialogue, your id is ${agent.name} when your partner has a different id.\n`
    )

    let agentControlProps = minecraftWorldActions.generateAgentControlProps(agent.name);
    const { result, status, messageHistory, oneTimeRun, oneTimeRunAsync, latestRequest, latestResponse, setLatestActionAndResponse } = useChatGPTCollaboration(blueprint, minecraftWorldActions, agentControlProps.state, prompt, false, agentConfig, logChatGPT, backendVersion);

    let action = parseGPTCommand(`place_block(block_type="yellow", pos=(0, 2, 2))`, agent);
    action = parseGPTCommand(`send_message(message="You placed the red block at (1, 2, 1), but it should be at (1, 3, 0). Please remove the red block at (1, 2, 1) and place it at (1, 3, 0)")`, agent);
    let lines = result.split("\n");


    const applyCommands = (text: string, actionLimit?: number) => {

        let actionCount = 0;
        let latestActionResponse: MinecraftWorldAgentActionResponse | undefined = undefined;
        let latestAction: MinecraftWorldAgentAction | undefined = undefined;

        for (let line of text.split("\n")) {
            let action = parseGPTCommand(line, agent);
            if (action) {
                if (action.actionType === "message") {
                    let messageAction = action as MinecraftWorldAgentMessageAction;
                    agentControlProps.actions.sendMessage(messageAction.message);
                    latestAction = messageAction as MinecraftWorldAgentMessageAction;
                    latestActionResponse = getMessageActionResponse(messageAction, minecraftWorldState);
                } else if (action.actionType === "break") {
                    let breakAction = action as MinecraftWorldAgentBreakAction;
                    latestAction = breakAction as MinecraftWorldAgentAction;
                    latestActionResponse = getBreakActionResponse(breakAction, minecraftWorldState);

                    agentControlProps.actions.breakBlock(breakAction.uid);
                    // if (latestActionResponse.success) {
                    //     // agentControlProps.actions.break(placeAction.blockType, placeAction.blockPos);
                    // }
                } else if (action.actionType === "place") {
                    let placeAction = action as MinecraftWorldAgentPlaceAction;

                    latestAction = placeAction as MinecraftWorldAgentAction;
                    latestActionResponse = getPlaceActionResponse(placeAction, minecraftWorldState);

                    agentControlProps.actions.placeBlock(placeAction.blockType, placeAction.blockPos);
                    // if (latestActionResponse.success) {
                    // }
                } else if (action.actionType === "end_session") {
                    let endAction = action as MinecraftWorldAgentEndAction;
                    agentControlProps.actions.endSession(endAction.message);
                    latestAction = endAction as MinecraftWorldAgentAction;
                    latestActionResponse = getEndSessionActionResponse(endAction, minecraftWorldState);
                } else {
                    minecraftWorldActions.addAgentAction(action);
                    // latestAction = action as MinecraftWorldAgentAction;
                    // latestActionResponse = getNullActionResponse(action, minecraftWorldState);
                }
                actionCount++;
            }
            if (actionCount && actionCount >= actionCount) {
                break;
            }
        }
        if (actionCount === 0) {
            agentControlProps.actions.nullAction();
            let nullAction: MinecraftWorldAgentNullAction = {
                actionType: "null",
                agentName: agent.name,
            }
            latestActionResponse = getNullActionResponse(nullAction, minecraftWorldState);
        }

        return {
            action: latestAction ? latestAction : { actionType: "null", agentName: agent.name } as MinecraftWorldAgentAction,
            response: latestActionResponse ? latestActionResponse : { message: "null action", success: true } as MinecraftWorldAgentActionResponse
        };
    }

    useEffect(() => {
        updateFetchResult(result, status, agentIndex);

    }, [result, status])

    useEffect(() => {
        oneTimeRunAsync().then((r) => {
            if (r[0]) {
                const { action, response } = applyCommands(r[1]);
                setLatestActionAndResponse(
                    {
                        action: action,
                        response: response
                    }
                )
                postProcess();
            }
        });
    }, [currentTurn])


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

    
    const currentStructureValid = validCurrentStructure(minecraftWorldActions.getCurrentBlocks(), {spec: blueprint, id: "", name: "", description: ""});

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
                    syncMode={true}
                    currentStructureValid={currentStructureValid}
                    allowFailure={allowFailure}
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
