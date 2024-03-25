
import { useEffect, useState, useRef } from "react";
import { OPENAI_API_KEY } from "../config";
import { MinecraftBlock, MinecraftBlock2D, MinecraftStructure, MinecraftWorldAgent } from "../types/minecraft";
import { MinecraftWorldActions, MinecraftWorldAgentControlState, MinecraftWorldAgentEndAction } from "../minecraft-collaboration/hooks";
import { ChatGPTMessage } from "./common";
import { MinecraftWorldAgentAction, MinecraftWorldAgentBreakAction, MinecraftWorldAgentMessageAction, MinecraftWorldAgentPlaceAction } from "../minecraft-collaboration/hooks";
import { generateUId } from "../types/utils";
import { MinecraftTaskAgentSpec, MotiveDetailLevel, StructureMotiveInstance, MotiveVisualDescription, MotiveTextualDescription, MinecraftTaskAgentView } from "../types/task";
import { convertStructureTo2DCoordinates } from "../utils/view";
import { stat } from "fs";
import { MinecraftWorldAgentActionResponse } from "../types/agent";
import { getActionCommandStr, getActionText } from "../minecraft-collaboration/utils/text";


function buildMinecraftBlockXML(block: MinecraftBlock) {
    return `<block block_type="${block.blockType}" pos=(${block.pos.x}, ${block.pos.y}, ${block.pos.z})/>`;
}
function buildMinecraftStructureText(minecraftStructure: MinecraftStructure) {
    let text = "";
    minecraftStructure.blocks.forEach(block => {
        text += buildMinecraftBlockXML(block);
    })
    return `<Structure> \n ${text} </Structure>`;
}

function buildStructureDescriptionPromptMessages(minecraftStructure: MinecraftStructure, prompt: string) {
    let structureText = buildMinecraftStructureText(minecraftStructure);
    let messages = [
        { "role": "system", "content": prompt },
        { "role": "assistant", "content": "Sure, please input the target structure to describe." },
        { "role": "user", "content": structureText }
    ]
    return messages;
}


async function callOpenAIAPI(messages: Array<ChatGPTMessage>, backendVersion?: String) {
    const { Configuration, OpenAIApi } = require("openai");
    const configuration = new Configuration({
        apiKey: OPENAI_API_KEY,
    });
    function timeout(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    const openai = new OpenAIApi(configuration);
    console.log(messages, backendVersion);
    return await fetch("/api/openai/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            messages: messages,
            backend_version: backendVersion || 'gpt-4'
        }),
    }).then(async (res) => {
        const data = await res.json();
        // @ts-ignore
        let result = data.choices[0].message.content.trim() as String;
        return result;
    })
    return openai.createChatCompletion({
        // model: "gpt-3.5-turbo",
        model: "gpt-4",
        messages: messages,
        // temperature: 0,
        max_tokens: 2048,
    }).then((res: any) => {
        let result = res.data.choices[0].message.content.trim() as String;
        return result;
    });
};



enum RequestStatus {
    IDLE = "idle",
    LOADING = "loading",
    SUCCESS = "success",
    DISABLED = "disabled",
    READY = "ready",
    ERROR = "error",
    RETRYING = "retrying",
    DELAYING = "delaying",
}

function useChatGPTStrcutureDescription(minecraftStructure: MinecraftStructure, prompt: string, enabled: boolean) {
    const [status, setStatus] = useState<RequestStatus>(RequestStatus.IDLE);
    const [response, setResponse] = useState<string>("");

    const promptMessages = buildStructureDescriptionPromptMessages(minecraftStructure, prompt);

    useEffect(() => {
        if (enabled) {
            setStatus(RequestStatus.LOADING);
            callOpenAIAPI(promptMessages).then((res: string) => {
                setResponse(res);
                setStatus(RequestStatus.SUCCESS);
            });
        } else {

        }

    }, [minecraftStructure, prompt, enabled]);

    return { result: response, status: status };
}


function generateMinecraftWorldXML(minecraftWorldActions: MinecraftWorldActions) {
    let xml = "<World> \n";
    minecraftWorldActions.getCurrentBlocks().forEach(block => {
        xml += buildMinecraftBlockXML(block) + "\n";
    });
    xml += "</World>";
    return xml;
}


function generateDialogueHistoryXML(minecraftWorldActions: MinecraftWorldActions) {
    let xml = "<Dialogue> \n";
    minecraftWorldActions.getMessages().forEach(message => {
        xml += `<chat sender="${message.sender}" content="${message.message}"/> \n`;
    });
    xml += "</Dialogue>";
    return xml;
}

function generateActionResponseHistoryXML(latestActionAndResponse: ActionAndResponse | undefined) {
    if (latestActionAndResponse) {
        return `
        <LastActionResponse>
            <Action command="${getActionCommandStr(latestActionAndResponse.action)}"/>
            <Response status=${latestActionAndResponse.response.success ? "success" : "failed"} message="${latestActionAndResponse.response.message}"/>
        </LastActionResponse>
    `
    }else{
        return `
        <LastActionResponse>
        </LastActionResponse>
        `
    }

}

function generateMyselfXML (agentConfig: MinecraftTaskAgentSpec){
    return `<Myself name=${agentConfig.name}/>\n`;
}


function generateInventoryXML(agentControlState: MinecraftWorldAgentControlState) {
    let xml = "<Inventory> \n";
    agentControlState.inventory.forEach(item => {
        xml += `<block block_type="${item.blockType}" count="${item.count}"/> \n`;
    });
    xml += "</Inventory>";
    return xml;
}

function generateBlueprintXML(blueprint: MinecraftStructure) {
    let text = "";
    if (blueprint.desc) {
        text += `<Description> ${blueprint?.desc} </Description>`
    }
    blueprint.blocks.forEach(block => {
        text += buildMinecraftBlockXML(block) + "\n";
    })
    return `<Blueprint> \n ${text} </Blueprint>`;
}


function generateBlock2DXML(block: MinecraftBlock2D) {
    return `<Block2D blockType=${block.blockType} x=${block.pos.x} y=${block.pos.y}/>`
}

function generateMotiveVisualViewXML(blocks: MinecraftBlock[], view: MinecraftTaskAgentView) {
    let blocks2D = convertStructureTo2DCoordinates({ blocks }, view);
    if (view !== MinecraftTaskAgentView.View3D) {
        return `
        <Visual2DView view="${view}">
            ${blocks2D.map(block => generateBlock2DXML(block)).join(" ")}
        </Visual2DView>
    `
    }
    else {
        return `<Visual3DView> ${blocks.map(buildMinecraftBlockXML)} </Visual3DView>`
    }

}

function generateMotiveXML(motive: StructureMotiveInstance) {
    if (motive.config.detailLevel === MotiveDetailLevel.VISUAL) {
        let visualDesc = motive.description as MotiveVisualDescription;
        return `<MotiveVisual> ${visualDesc.views.map(view => generateMotiveVisualViewXML(visualDesc.blocks, view))}  </MotiveVisual>`;

    } else {
        let textualDesc = motive.description as MotiveTextualDescription;
        return `<MotiveTextual>  ${textualDesc.text} </MotiveTextual>`
    }
}

function generateMotiveListXML(motvies: StructureMotiveInstance[]) {
    return `
        <Motives>
            ${motvies.map(motive => generateMotiveXML(motive))}
        </Motives>
    `
}


function generatePostfixMessage(minecraftWorldActions: MinecraftWorldActions, agentConfig: MinecraftTaskAgentSpec){
    let agentName = agentConfig.name;
    let lastMessage = minecraftWorldActions.getMessages().filter(d => d.sender !== agentName).slice(-1)[0];
    return `${lastMessage? lastMessage.message : ""}`;
}




interface GPTCallBackType {
    state: boolean,
    result: string
}

interface ActionAndResponse {
    action: MinecraftWorldAgentAction;
    response: MinecraftWorldAgentActionResponse
}

interface ComparisonResult {
    missingBlocks: MinecraftBlock[];
    extraBlocks: MinecraftBlock[];
}

function compareWorldWithBlueprint(worldBlocks: MinecraftBlock[], blueprint: MinecraftStructure): ComparisonResult {
    let missingBlocks: MinecraftBlock[] = [];
    let extraBlocks: MinecraftBlock[] = [];
    blueprint.blocks.forEach(block => {
        let found = worldBlocks.find(worldBlock => worldBlock.pos.x === block.pos.x && worldBlock.pos.y === block.pos.y && worldBlock.pos.z === block.pos.z);
        if (!found) {
            missingBlocks.push(block);
        }
    });
    worldBlocks.forEach(block => {
        let found = blueprint.blocks.find(blueprintBlock => blueprintBlock.pos.x === block.pos.x && blueprintBlock.pos.y === block.pos.y && blueprintBlock.pos.z === block.pos.z);
        if (!found) {
            extraBlocks.push(block);
        }
    });
    return { missingBlocks, extraBlocks };
}

function generateComparisonResultXML(comparisonResult: ComparisonResult) {
    return `
        <ComparisonResult>
            <MissingBlocks>
                ${comparisonResult.missingBlocks.map(block => buildMinecraftBlockXML(block)).join(" ")}
            </MissingBlocks>
            <ExtraBlocks>
                ${comparisonResult.extraBlocks.map(block => buildMinecraftBlockXML(block)).join(" ")}
            </ExtraBlocks>
        </ComparisonResult>
    `
}


function useChatGPTCollaboration(blueprint: MinecraftStructure,
    minecraftWorldActions: MinecraftWorldActions, agentControlState: MinecraftWorldAgentControlState,
    prompt: string, enabled: boolean, agentConfig: MinecraftTaskAgentSpec, externalEffectsOnMessageReceived?: (messages: Array<String>, response: string) => void | undefined, backendVersion?: String) {
    const [status, setStatus] = useState<RequestStatus>(RequestStatus.IDLE);
    const [response, setResponse] = useState<string>("");
    const [messageHistory, setMessageHistory] = useState<Array<ChatGPTMessage>>([
        { "role": "system", "content": prompt },
    ]);
    const [latestRequest, setLatestRequest] = useState<string>("");
    const [latestResponse, setLatestResponse] = useState<string>("");

    const [latestActionAndResponse, setLatestActionAndResponse] = useState<ActionAndResponse>();



    const blueprintXML = generateBlueprintXML(agentConfig.blueprint ? agentConfig.blueprint.spec : blueprint);

    const [errorCount, setErrorCount] = useState<number>(0);

    const myselfXML = generateMyselfXML(agentConfig);
    const motivesXML = generateMotiveListXML(agentConfig.motives);
    const inventoryXML = generateInventoryXML(agentControlState);
    const worldXML = generateMinecraftWorldXML(minecraftWorldActions);
    const dialogueHistoryXML = generateDialogueHistoryXML(minecraftWorldActions);
    const postfixMessage = generatePostfixMessage(minecraftWorldActions, agentConfig);
    const comparisonResult = compareWorldWithBlueprint(minecraftWorldActions.getCurrentBlocks(), blueprint);
    const comparisonXML = generateComparisonResultXML(comparisonResult);

    const latestActionResponseXML = generateActionResponseHistoryXML(latestActionAndResponse);

    const statusRef = useRef<string>(status); // Define the useRef outside of the callback
    const responseRef = useRef<string>(""); // Define the useRef outside of the callback


    // useEffect(() => {
    //     setMessageHistory((prev) => [
    //         ...prev.map((message) => {
    //             if (message.role === "system") {
    //                 return { "role": "system", "content": prompt };
    //             } else {
    //                 return message;
    //             }
    //         }),
    //     ]);
    // }, [prompt])
    useEffect(() => {
        setMessageHistory((prev) => [
            ...prev.map((message) => {
                if (message.role === "system") {
                    return { "role": "system", "content": prompt };
                } else {
                    return message;
                }
            }),
        ]);
    }, [prompt]);

    const oneTimeRun = (delayTime: number =0) => {
        if (status !== RequestStatus.LOADING) {
            if(delayTime !== 0){
                setStatus(RequestStatus.DELAYING);
                setTimeout(
                    () => {
                        setStatus(RequestStatus.READY);
                    }, delayTime
                )
            }else{
                setStatus(RequestStatus.READY);
            }
        }
    }
    const oneTimeRunAsync = (): Promise<[boolean, string]> => {
        const TIMEOUT = 30000;
        if (status !== RequestStatus.LOADING) {
            setStatus(RequestStatus.READY);
            return new Promise<[boolean, string]>((resolve) => {
                const startTime = Date.now();

                const checkValue = () => {
                    if (statusRef.current === RequestStatus.SUCCESS) {
                        resolve([
                            true, responseRef.current
                        ]); // Desired value reached, return true
                        return;
                    }

                    const currentTime = Date.now();
                    if (currentTime - startTime >= TIMEOUT) {
                        resolve([false, '# timeout']); // Time exceeded, return false
                        return;
                    }

                    setTimeout(checkValue, 100); // Check again after 100ms
                };
                setTimeout(checkValue, 1000);
                // checkValue();
            });
        } else {
            return new Promise<[boolean, string]>((resolve) => {
                resolve([false, '# invalid']);
                return
            });
        }

    }
    useEffect(() => {
        // Update the stateRef whenever myState changes
        statusRef.current = status;

    }, [status,]);

    useEffect(() => {
        // Update the stateRef whenever myState changes
        responseRef.current = latestResponse;

    }, [latestResponse]);

    // useEffect(() => {
    //     
    // }, [blueprint, minecraftWorldActions, agentControlState, currentMessage]);
    const runFetch = () => {
        const TRIAL_LIMIT = 3;
        let currentMessage = {
            "role": "user",
            "content": "<Input> \n" + motivesXML + "\n" + inventoryXML + "\n" + worldXML + "\n" + dialogueHistoryXML + comparisonXML + "\n</Input>"
        }
        const newMessageHistory = [...messageHistory, currentMessage];
        setMessageHistory(newMessageHistory);
        setLatestRequest(currentMessage.content);
        for (let i = 0; i < TRIAL_LIMIT; i++) {

        }
    }


    useEffect(() => {
        if (true) {
            let currentMessage = {
                "role": "user",
                "content": "# Generating the proper action beased on the following input: \n" + "<Input> \n" + myselfXML + motivesXML + "\n" + inventoryXML + "\n" + worldXML + "\n" + dialogueHistoryXML + "\n" + "\n" + comparisonXML + "\n" +latestActionResponseXML + "\n</Input>" + "\n" + postfixMessage + "\n# Please reply with the action commands e.g., place_block(block_type=\"red\", pos=(0, 1, 2))"
            }
            setLatestRequest(currentMessage.content);
            if (status === RequestStatus.READY || (status === RequestStatus.ERROR && errorCount < 3)) {
                const newMessageHistory = [...messageHistory, currentMessage];
                setMessageHistory(newMessageHistory);
                if (status === RequestStatus.ERROR) {
                    setStatus(RequestStatus.RETRYING);

                } else {
                    setStatus(RequestStatus.LOADING);
                }

                let messages = [
                    {
                        ...newMessageHistory[0],
                        content: newMessageHistory[0].content + "\n" + currentMessage.content
                    }
                ]
                messages = [newMessageHistory[0], currentMessage]
                callOpenAIAPI(messages, backendVersion).then((res: string) => {
                    setResponse(res);
                    setMessageHistory([...newMessageHistory, { "role": "assistant", "content": res }])
                    setStatus(RequestStatus.SUCCESS);
                    setLatestResponse(res);
                    setErrorCount(0);
                    if (externalEffectsOnMessageReceived) {
                        externalEffectsOnMessageReceived(
                            newMessageHistory.map(message => message.content),
                            res
                        )

                    }
                }).catch((err: any) => {
                    setStatus(RequestStatus.ERROR);
                    setErrorCount(prev => prev + 1);
                    console.log("error!");
                });
            }

        } else {

        }

    }, [blueprint, prompt, enabled, status]);
    return {
        result: response, status: status, messageHistory: messageHistory, oneTimeRun: oneTimeRun, oneTimeRunAsync, setLatestActionAndResponse,
        latestRequest: latestRequest, latestResponse: latestResponse
    };
}

function parseGPTCommand(commandStr: string, agent: MinecraftWorldAgent): MinecraftWorldAgentAction | null {
    let action: MinecraftWorldAgentAction | null = null;

    if (commandStr.startsWith("place_block")) {

        const placeMatch = commandStr.match(
            /place_block\(block_type="(\w+)", pos=\((-?\d+), (-?\d+), (-?\d+)\)\)/
        );
        // /place_block\(block_type="(\w+)", pos=\((\d+), (\d+), (\d+)\)\)/
        if (placeMatch) {
            let placeAction: MinecraftWorldAgentPlaceAction = {
                actionType: "place",
                agentName: agent.name,
                blockType: placeMatch[1],
                blockPos: {
                    x: parseInt(placeMatch[2]),
                    y: parseInt(placeMatch[3]),
                    z: parseInt(placeMatch[4]),
                },
                uid: generateUId(),
            };
            action = placeAction;
            return action;
        }
    } else if (commandStr.startsWith("break_block")) {
        const breakMatch = commandStr.match(/break_block\(pos=\((\d+), (\d+), (\d+)\)\)/);
        if (breakMatch) {
            let breakAction: MinecraftWorldAgentBreakAction = {
                actionType: "break",
                agentName: agent.name,
                uid: "",

            };
            action = breakAction;
            return action;
        }
    } else if (commandStr.startsWith("send_message")) {
        const messageMatch = commandStr.match(/send_message\(message="(.+)"\)/);
        if (messageMatch) {
            let messageAction: MinecraftWorldAgentMessageAction = {
                actionType: "message",
                agentName: agent.name,
                message: messageMatch[1],
            }
            action = messageAction;
            return action;
        }
        return action;
    } else if (commandStr.startsWith("end_session")) {
        const messageMatch = commandStr.match(/end_session\(message="(.+)"\)/);
        if (messageMatch) {
            let messageAction: MinecraftWorldAgentEndAction = {
                actionType: "end_session",
                agentName: agent.name,
                message: messageMatch[1],
            }
            action = messageAction;
            return action;
        }
        return action;
    }
    else {
        return null;
    }
    return null;

}

export {
    useChatGPTStrcutureDescription, RequestStatus, buildMinecraftBlockXML, buildMinecraftStructureText, buildStructureDescriptionPromptMessages, useChatGPTCollaboration,
    parseGPTCommand
};