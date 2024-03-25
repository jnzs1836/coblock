import React, { useState } from "react";
import {
    Box,
    FormControlLabel,
    FormGroup,
    Switch,
    TextField,
} from "@mui/material";
import { styled } from "@mui/system";
import {
    MinecraftBlueprint, MinecraftWorldAgentAction, MinecraftWorldAgentInventoryBlockState

} from "../../types/minecraft";
import { TaskWorkLoadType, TaskMotiveType, TaskSkillsetType, MinecraftTaskSpec, MinecraftTaskInstance } from "../../types/task";
import { useNavigate } from 'react-router-dom';
import { useAuthHeader } from 'react-auth-kit';
import { PromptCheckpoint } from "../../types/prompt";

export function useTaskConfig(blueprints: MinecraftBlueprint[], promptCheckpointList: PromptCheckpoint[], sessionId?: string) {
    const [humanAgentInventory, setHumanAgentInventory] = useState<MinecraftWorldAgentInventoryBlockState[]>([]);
    const [machineAgentInventory, setMachineAgentInventory] = useState<MinecraftWorldAgentInventoryBlockState[]>([]);


    const [taskSpec, setTaskSpec] = useState<MinecraftTaskSpec>({
        workLoadType: TaskWorkLoadType.Equal,
        motiveType: TaskMotiveType.Parallel,
        skillsetType: TaskSkillsetType.Sychronous,
    });

    const [taskInstance, setTaskInstance] = useState<MinecraftTaskInstance>({
        id: "",
        spec: taskSpec,
        blueprints: [],
        agents: [
            {
                blueprint: blueprints[0],
                inventory: [],
                views: [],
                role: "human",
                name: "Agent 0",
                motives: []
            },
            {
                blueprint: blueprints[1],
                inventory: [],
                views: [],
                role: "machine",
                name: "Agent 1",
                motives: []
            },
        ],
        baseBlueprint: undefined,
        promptCheckpoint: promptCheckpointList[0],
    });
    const authHeader = useAuthHeader();
    const navigate = useNavigate();

    const onSessionStart = () => {
        let updatedTakInstance = {
            ...taskInstance,
            agents: taskInstance.agents.map((agent, index) => {
                return agent;
            }),

        };
        console.log(updatedTakInstance);
        let formData = new FormData();
        // @ts-ignore
        formData.append("blueprint_id", updatedTakInstance.baseBlueprint.id);
        // @ts-ignore
        formData.append("blueprint", updatedTakInstance.baseBlueprint.id);
        formData.append("task_config", JSON.stringify(updatedTakInstance));
        formData.append("prompt_config", JSON.stringify(updatedTakInstance.promptCheckpoint));
        if (updatedTakInstance.promptCheckpoint) {
            formData.append("prompt_checkpoint", updatedTakInstance.promptCheckpoint.id);
        }

        if (sessionId) {

            fetch(`/api/collaboration/${sessionId}/`, {
                method: 'PUT',
                headers: {
                    // 'Content-Type': 'multipart/form-data; boundary=' + boundary,
                    'Authorization': authHeader()
                    // ...authHeader(),
                },
                body: formData,
            })
                .then(response => {
                    if (!response.ok) {
                        throw Error(response.statusText);
                    }
                    return response.json();
                }
                )
                .then(data => {
                    // navigate(`/collaboration/${data.id}`);

                }
                )
                .catch(error => {

                    console.log(error);
                }
                )
        } else {
            fetch(`/api/collaboration/`, {
                method: 'POST',
                headers: {
                    // 'Content-Type': 'multipart/form-data; boundary=' + boundary,
                    'Authorization': authHeader()
                    // ...authHeader(),
                },
                body: formData,
            })
                .then(response => {
                    if (!response.ok) {
                        throw Error(response.statusText);
                    }
                    return response.json();
                }
                )
                .then(data => {
                    navigate(`/collaboration/${data.id}`);

                }
                )
                .catch(error => {

                    console.log(error);
                }
                )

        }
    };


    const setAgentInfo = (agentIndex: number, agentInfo: any) => {
        setTaskInstance({
            ...taskInstance,
            agents: taskInstance.agents.map((agent, index) => {
                if (index === agentIndex) {
                    return {
                        ...agent,
                        ...agentInfo,
                    };
                }
                return agent;
            }),
        });
    };
    const setAgentInventory = (agentIndex: number, inventory: MinecraftWorldAgentInventoryBlockState[]) => {
        setTaskInstance({
            ...taskInstance,
            agents: taskInstance.agents.map((agent, index) => {
                if (index === agentIndex) {
                    return {
                        ...agent,
                        inventory: inventory,
                    };
                }
                return agent;
            }),
        });
    };


    return {
        humanAgentInventory, setHumanAgentInventory,
        machineAgentInventory, setMachineAgentInventory,
        taskSpec, setTaskSpec,
        taskInstance, setTaskInstance,
        onSessionStart,
        setAgentInfo, setAgentInventory
    }

}