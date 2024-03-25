import React, {useEffect} from 'react';
import logo from './logo.svg';
import '../App.css';
import NavigationBar from '../page/navigation-bar';
import PageContent from '../page/page-content';
import MinecraftViewerContainer from '../minecraft-viewer/minecraft-viewer-container';
// import styled from '@emotion/styled';
import {styled} from "@mui/material"
import MinecraftEditor from '../minecraft-editor/minecraft-editor';
import { MinecraftBlock, MinecraftBlueprint } from '../types/minecraft';
import { generateUId } from '../types/utils';
import ChatGPTPanel from '../chatgpt/chatgpt-panel';
import MinecraftEditorControlPanel from '../minecraft-editor/minecraft-editor-control-panel';
import { useBlueprintManagement } from '../minecraft-editor/editor-control';
import { useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useBlueprintGetAPI } from '../management/blueprint-management-hooks';
import { useNavigate } from 'react-router-dom';
const Column = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  justifyContent: 'flex-start',
//   height: '100vh',
  color: 'white',
  marginLeft: '1rem',
});

const initialBlocks: MinecraftBlock[] = [
  { blockType: 'red', pos: { x: 0, y: 1, z: 2 }, uid: generateUId() },
  { blockType: 'green', pos: { x: 1, y: 2, z: 3 }, uid: generateUId()  },
  // { blockType: 'blue', pos: { x: -1, y: 0, z: -1 } },
  ];

interface StructureCreatorPageProps {
}

export default function StructureCreatorRedirectPage({}: StructureCreatorPageProps){

    
    const {data: blueprint, isLoading} = useBlueprintGetAPI("");
    const navigate = useNavigate();
    useEffect(() => {
        if (blueprint) {
            navigate(`/creator/${blueprint.id}`);
        }
    }, [blueprint]);

    

    return (
        <div className="App">
        <NavigationBar/>
        {/* <PageContent>
        </PageContent> */}
        </div>
    )
}