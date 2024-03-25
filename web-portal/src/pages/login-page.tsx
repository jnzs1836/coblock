import React from 'react';
import logo from './logo.svg';
import '../App.css';
import NavigationBar from '../page/navigation-bar';
import PageContent from '../page/page-content';
import MinecraftViewerContainer from '../minecraft-viewer/minecraft-viewer-container';
// import styled from '@emotion/styled';
import {styled} from "@mui/material"
import MinecraftEditor from '../minecraft-editor/minecraft-editor';
import { MinecraftBlock } from '../types/minecraft';
import { generateUId } from '../types/utils';
import ChatGPTPanel from '../chatgpt/chatgpt-panel';
import { useMinecraftBlueprint } from '../minecraft-blueprint/blueprint-hooks';
import MinecraftCollaborationInput from '../minecraft-collaboration/minecraft-collaboration-input';
import { useMinecraftWorld } from '../minecraft-collaboration/hooks';
import MinecraftCollaborationDialogue from '../minecraft-collaboration/minecraft-collaboration-dialogue';
import MinecraftChatGPTPanel from '../minecraft-collaboration/minecraft-chatgpt-panel';
import LoginView from '../login/login-view';
import { Column, FlexStartColumn } from '../page/styled-components';


const initialBlocks: MinecraftBlock[] = [
  { blockType: 'red', pos: { x: 0, y: 1, z: 2 }, uid: generateUId() },
  { blockType: 'green', pos: { x: 1, y: 2, z: 3 }, uid: generateUId()  },
  // { blockType: 'blue', pos: { x: -1, y: 0, z: -1 } },
  ];

export default function LoginPage(){

    const [blocks, setBlocks] = React.useState<Array<MinecraftBlock>>([]);
    const {blueprint} = useMinecraftBlueprint();

    const syncWorldBlocks = (blocks: MinecraftBlock[]) => {
        setBlocks(blocks);
    }

    const minecraftStructure = {
        blocks: blocks,
    }



    return (
        <div className="App">
        {/* <NavigationBar/> */}
        {/* <PageContent> */}
            {/* <FlexStartColumn> */}
                <LoginView/>

            {/* </FlexStartColumn> */}
        {/* </PageContent> */}
        </div>
    )
}