import React from 'react';
import logo from './logo.svg';
import '../App.css';
import NavigationBar from '../page/navigation-bar';
import PageContent from '../page/page-content';
import MinecraftViewerContainer from '../minecraft-viewer/minecraft-viewer-container';
// import styled from '@emotion/styled';
import {styled} from "@mui/material"
import MinecraftEditor from '../minecraft-editor/minecraft-editor';
import { MinecraftBlock, MinecraftCollaborationCheckpoint } from '../types/minecraft';
import { generateUId } from '../types/utils';
import ChatGPTPanel from '../chatgpt/chatgpt-panel';
import { useMinecraftBlueprint } from '../minecraft-blueprint/blueprint-hooks';
import MinecraftCollaborationInput from '../minecraft-collaboration/minecraft-collaboration-input';
import { useCollaborationSession, useMinecraftWorld } from '../minecraft-collaboration/hooks';
import MinecraftCollaborationDialogue from '../minecraft-collaboration/minecraft-collaboration-dialogue';
import MinecraftChatGPTPanel from '../minecraft-collaboration/minecraft-chatgpt-panel';
import {withAuthUser, useAuthUser, useAuthHeader} from 'react-auth-kit'
import BlueprintTable from '../management/blueprint-table';
import { useBlueprintListAPI } from '../management/blueprint-management-hooks';
import { useParams } from 'react-router-dom';
import CheckpointPanel from "../minecraft-collaboration/checkpoint/checkpoint-panel";
import { useCollaborationCheckpoint } from '../minecraft-collaboration/checkpoint/checkpoint-hooks';
import { saveCheckpointAPI } from '../minecraft-collaboration/checkpoint/api';
import { stat } from 'fs';
const Column = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  justifyContent: 'flex-start',
  height: '100vh',
  color: 'white',
  marginLeft: '1rem',
});

// const initialBlocks: MinecraftBlock[] = [
//   { blockType: 'red', pos: { x: 0, y: 1, z: 2 }, uid: generateUId() },
//   { blockType: 'green', pos: { x: 1, y: 2, z: 3 }, uid: generateUId()  },
//   // { blockType: 'blue', pos: { x: -1, y: 0, z: -1 } },
//   ];

function ModelCollaborationPage(){

    const { sessionId } = useParams();
    const [blocks, setBlocks] = React.useState<Array<MinecraftBlock>>([]);
    // const {blueprint} = useMinecraftBlueprint();
    const syncWorldBlocks = (blocks: MinecraftBlock[]) => {
        setBlocks(blocks);
    }
    const {state: {collaborationSession, isLoading}} = useCollaborationSession(sessionId);
    const [state, actions] = useMinecraftWorld([], syncWorldBlocks, collaborationSession?.config);

    const {state: checkpointHookState, actions: checkpointHookActions } = useCollaborationCheckpoint(actions.loadState, collaborationSession);


    const authHeader = useAuthHeader();

    if(!collaborationSession){
        return <div></div>
    }
    const blueprint = collaborationSession.blueprint;
    

    
    const minecraftStructure = {
        blocks: blocks,
    }

    
    return (
        <div className="App">
        <NavigationBar/>
        <PageContent
            sx={{
                paddingBottom: '3rem',
            }}
        >
            
            <Column>
                
                <MinecraftViewerContainer
                    sx={{marginBottom: 2}}
                    blocks={blocks}
                />
                <MinecraftViewerContainer
                    blocks={blueprint.spec.blocks}
                />

            </Column>
            <Column
                sx={{
                    marginRight: '1rem',
                    
                }}
            >

                
                {/* <MinecraftChatGPTPanel
                    blueprint={blueprint.spec}
                    minecraftWorldState={state}
                    minecraftWorldActions={actions}
                    promptCheckpoint={collaborationSession.config.promptCheckpoint}
                />
                <MinecraftChatGPTPanel
                    blueprint={blueprint.spec}
                    minecraftWorldState={state}
                    minecraftWorldActions={actions}
                    promptCheckpoint={collaborationSession.config.promptCheckpoint}
                /> */}
               
                {/* <MinecraftEditor
                syncBlocks={setBlocks}
                blocks={initialBlocks}
                /> */}

            </Column>
            <Column
            sx={{
                marginRight: '1rem',
                
            }}>
                <MinecraftCollaborationDialogue
                    sx={{marginBottom: 2}}
                    messages={actions.getMessages()}
                />
                <CheckpointPanel
                    onSave={(name: string) => {
                        return saveCheckpointAPI(authHeader(), name, collaborationSession, state);
                        // checkpointHookActions.onSave(name, state);
                    }}
                    onLoad={(checkpoint: MinecraftCollaborationCheckpoint) => {
                        checkpointHookActions.onLoad(checkpoint);
                    }}
                    checkpoints={checkpointHookState.checkpoints}
                />
            
            </Column>
        </PageContent>
        </div>
    )
}

export default ModelCollaborationPage;
