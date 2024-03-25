import React from 'react';
import logo from './logo.svg';
import '../App.css';
import NavigationBar from '../page/navigation-bar';
import PageContent from '../page/page-content';
import MinecraftViewerContainer from '../minecraft-viewer/minecraft-viewer-container';
// import styled from '@emotion/styled';
import { styled } from "@mui/material"
import MinecraftEditor from '../minecraft-editor/minecraft-editor';
import { MinecraftBlock, MinecraftBlueprint, MinecraftCollaborationCheckpoint, MinecraftStructure, MinecraftWorldState } from '../types/minecraft';
import { generateUId } from '../types/utils';
import ChatGPTPanel from '../chatgpt/chatgpt-panel';
import { useMinecraftBlueprint } from '../minecraft-blueprint/blueprint-hooks';
import MinecraftCollaborationInput from '../minecraft-collaboration/minecraft-collaboration-input';
import { MinecraftWorldActions, useCollaborationSession, useMinecraftWorld } from '../minecraft-collaboration/hooks';
import MinecraftCollaborationDialogue from '../minecraft-collaboration/minecraft-collaboration-dialogue';
import MinecraftChatGPTPanel from '../minecraft-collaboration/minecraft-chatgpt-panel';
import { withAuthUser, useAuthUser, useAuthHeader } from 'react-auth-kit'
import BlueprintTable from '../management/blueprint-table';
import { useBlueprintListAPI } from '../management/blueprint-management-hooks';
import { useParams } from 'react-router-dom';
import CheckpointPanel from "../minecraft-collaboration/checkpoint/checkpoint-panel";
import { useCollaborationCheckpoint } from '../minecraft-collaboration/checkpoint/checkpoint-hooks';
import { saveCheckpointAPI } from '../minecraft-collaboration/checkpoint/api';
import { MinecraftCollaborationSession, MinecraftTaskAgentSpec } from "../types/task";
import CollaborationAutoControlPanel from "../minecraft-collaboration/auto-control/collaboration-auto-control-panel"
import { AgentAutoMeta, useAutoExecution } from '../minecraft-collaboration/auto-control/hooks';
import { RequestState } from '../web/types';
import { RequestStatus } from '../chatgpt/chatgpt-hooks';


const renderAgentPanel = (sessionId: string | undefined, agentConfig: MinecraftTaskAgentSpec, index: number,
        state: MinecraftWorldState, actions: MinecraftWorldActions,
        blueprint: MinecraftStructure, collaborationSession: MinecraftCollaborationSession,
        registerAutoExecution: (autoExecution: AgentAutoMeta, index: number) => void,
        updateFetchResult: (result: string, status: RequestStatus,  index: number) => void,
        syncWorldBlocks: (blocks: MinecraftBlock[]) => void,
        logChatGPT?: (messages: Array<String>, response: string) => void | undefined,
    ) => {
    if (agentConfig.role === "machine") {
        return (
            <MinecraftChatGPTPanel
                sessionId={sessionId? sessionId : ""}
                key={`${collaborationSession.id}-${index}}`}
                blueprint={blueprint}
                minecraftWorldState={state}
                minecraftWorldActions={actions}
                promptCheckpoint={collaborationSession.config.promptCheckpoint}
                agent={{
                    name: agentConfig.name,
                    role: agentConfig.role,
                }}
                registerAutoExecution={registerAutoExecution}
                updateFetchResult={updateFetchResult}
                agentConfig={agentConfig}
                agentIndex={index}
                logChatGPT={logChatGPT? logChatGPT: undefined}
                backendVersion='gpt-4'
            />
        )
    } else {
        return (<MinecraftCollaborationInput
            key={index}
            state={state}
            actions={actions}
            syncBlocks={syncWorldBlocks}
            agentConfig={agentConfig}
        />)
    }
}

export {renderAgentPanel};