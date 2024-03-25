import React from 'react';
import logo from './logo.svg';
import '../App.css';
import NavigationBar from '../page/navigation-bar';
import PageContent from '../page/page-content';
import MinecraftViewerContainer from '../minecraft-viewer/minecraft-viewer-container';
// import styled from '@emotion/styled';
import {styled, Button, Card} from "@mui/material"
import { MinecraftBlock } from '../types/minecraft';
import { useMinecraftBlueprint } from '../minecraft-blueprint/blueprint-hooks';
import { useMinecraftWorld } from '../minecraft-collaboration/hooks';
import { Column, FlexStartColumn, StyledCard, StyledCardContent, StyledCardHeader } from '../page/styled-components';
import BlueprintTable from '../management/blueprint-table';
import { useBlueprintListAPI, useBlueprintTable } from '../management/blueprint-management-hooks';
import TaskConfigPanel from '../management/task-config/task-config-panel';
import { useTaskConfig } from '../management/task-config/hooks';
import TaskAgentEditPanel from '../management/task-config/task-agent-edit-panel';
import TaskSpecConfig from "../management/task-config/task-spec-config";
import BlueprintSelection from "../management/task-config/task-blueprint-select";
import TaskAgentConfigPanel from "../management/task-config/task-agent-config-panel";
import { TaskWorkLoadType, TaskMotiveType, TaskSkillsetType, MinecraftTaskSpec, MinecraftTaskInstance, StructureMotiveInstance } from "../types/task";
import {MinecraftBlueprint} from "../types/minecraft";
import TaskInventoryConfig from "../management/task-config/task-inventory-config";
import PromptCheckpointPanel from '../management/prompt-checkpoint/prompt-checkpoint-panel';
import {usePromptCheckpointList} from "../management/prompt-checkpoint/hooks";
import {MinecraftWorldAgentInventoryBlockState} from "../types/minecraft";


export default function TaskConfigPage(){

    const [blocks, setBlocks] = React.useState<Array<MinecraftBlock>>([]);
    const {blueprint} = useMinecraftBlueprint();

    const syncWorldBlocks = (blocks: MinecraftBlock[]) => {
        setBlocks(blocks);
    }


    const minecraftStructure = {
        blocks: blocks,
    }

    // const {data: blueprintList} = useBlueprintListAPI();
    // const {state: {blueprints}, actions: {onBlueprintDelete, onBlueprintEdit, onBlueprintCollaborationStart}} = useBlueprintTable();


    const {data: blueprints} = useBlueprintListAPI();

    const {result: promptCheckpointList} = usePromptCheckpointList();
    const {
        humanAgentInventory, setHumanAgentInventory,
        machineAgentInventory, setMachineAgentInventory,
        taskInstance, setTaskInstance,
        taskSpec, setTaskSpec,
        onSessionStart,
        setAgentInfo, setAgentInventory
     } = useTaskConfig(blueprints, promptCheckpointList);


    return (
        <div className="App">
        <NavigationBar/>
        <PageContent>
            <FlexStartColumn
                sx={{
                    flex: 1,
                    flexGrow: 2
                }}
            >   
                <PromptCheckpointPanel
                    promptCheckpointList={promptCheckpointList}
                    sx={{
                        width: "100%"
                    }}
                    selectedCheckpoint={taskInstance.promptCheckpoint?taskInstance.promptCheckpoint.id : undefined}
                    setSelectedCheckpoint={(checkpointId: string | undefined) => {
                        setTaskInstance((prev) => {
                            const newTaskInstance = { ...prev };
                            let checkpoint = promptCheckpointList.find((checkpoint) => checkpoint.id === checkpointId);
                            newTaskInstance.promptCheckpoint = checkpoint;
                            return newTaskInstance;
                        });
                    }}
                />

                <Card>
                
                    <BlueprintSelection
                        taskInstance={taskInstance}
                        setTaskInstance={setTaskInstance}
                        blueprints={blueprints}
                        onSetAgentBlueprint={(blueprint, agentIndex) => {
                        setTaskInstance((prev) => {
                            const newTaskInstance = { ...prev,
                                baseBlueprint: blueprint
                            };
                            const agent = newTaskInstance.agents[agentIndex]
                            if (agent) {
                                agent.blueprint = blueprint;
                            }

                            const agent1 = newTaskInstance.agents[1]
                            if (agent1) {
                                agent1.blueprint = blueprint;
                            }

                            return newTaskInstance;
                        }
                        );
                        }
                        }
                    />
                    </Card>
                
            </FlexStartColumn>
            <FlexStartColumn
                sx={{
                    flex: 1,
                    flexGrow: 2
                }}
            >
                <TaskConfigPanel
                    taskInstance={taskInstance}
                    setTaskInstance={setTaskInstance}
                    taskSpec={taskSpec}
                    setTaskSpec={setTaskSpec}
                    blueprints={blueprints}
                />
                {/* <TaskAgentEditPanel
                    inventory={humanAgentInventory}
                    setInventory={setHumanAgentInventory}
                    agentName='Human'
                /> */}
                <TaskAgentEditPanel
                    inventory={taskInstance.agents[0].inventory}
                    setInventory={(newInventory: MinecraftWorldAgentInventoryBlockState[]) => {setAgentInventory(0, newInventory)}}
                    agentName={taskInstance.agents[0].name}
                    setAgentName={(name: string) => {
                        setAgentInfo(0, {
                            ...taskInstance.agents[0],
                            name: name
                        })
                        }
                    }
                    setAgentType={(type: string) => {
                        setAgentInfo(0, {
                            ...taskInstance.agents[0],
                            role: type
                        })
                    }}
                    
                    blueprint={taskInstance.baseBlueprint}
                    motives={taskInstance.agents[0].motives}
                    setMotives={(fn: (motives: StructureMotiveInstance[])=> StructureMotiveInstance[]) => {
                        setAgentInfo(0, {
                            ...taskInstance.agents[0],
                            motives: fn(taskInstance.agents[0].motives)
                        })
                    }}
                    agentType={taskInstance.agents[0].role}

                />

                <TaskAgentEditPanel
                    inventory={taskInstance.agents[1].inventory}
                    setInventory={(newInventory: MinecraftWorldAgentInventoryBlockState[]) => {setAgentInventory(1, newInventory)}}
                    agentName={taskInstance.agents[1].name}
                    setAgentName={(name: string) => {
                        setAgentInfo(1, {
                            ...taskInstance.agents[1],
                            name: name
                        })
                        }
                    }
                    setAgentType={(type: string) => {
                        setAgentInfo(1, {
                            ...taskInstance.agents[1],
                            role: type
                        })
                    }}
                    blueprint={taskInstance.baseBlueprint}
                    motives={taskInstance.agents[1].motives}
                    setMotives={(fn: (motives: StructureMotiveInstance[])=> StructureMotiveInstance[]) => {
                        setAgentInfo(1, {
                            ...taskInstance.agents[1],
                            motives: fn(taskInstance.agents[1].motives)
                        })
                    }}
                    agentType={taskInstance.agents[1].role}
                />

                <Button 
                    variant="contained"
                    onClick={() => onSessionStart()}
                >
                    Start Task
                </Button>
            </FlexStartColumn>
        </PageContent>
        </div>
    )
}