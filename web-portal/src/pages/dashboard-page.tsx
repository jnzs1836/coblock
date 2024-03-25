import React from 'react';
import logo from './logo.svg';
import '../App.css';
import NavigationBar from '../page/navigation-bar';
import PageContent from '../page/page-content';
import MinecraftViewerContainer from '../minecraft-viewer/minecraft-viewer-container';
// import styled from '@emotion/styled';
import {styled} from "@mui/material"
import { MinecraftBlock } from '../types/minecraft';
import { useMinecraftBlueprint } from '../minecraft-blueprint/blueprint-hooks';
import { useMinecraftWorld } from '../minecraft-collaboration/hooks';
import { Column, FlexStartColumn } from '../page/styled-components';
import BlueprintTable from '../management/blueprint-table';
import { useBlueprintListAPI, useBlueprintTable } from '../management/blueprint-management-hooks';
import { useCollaborationSessionTable } from '../management/session-hooks';
import CollaborationSessionTable from '../management/collaboration-session-table';


export default function DashboardPage(){

    const [blocks, setBlocks] = React.useState<Array<MinecraftBlock>>([]);
    const {blueprint} = useMinecraftBlueprint();

    const syncWorldBlocks = (blocks: MinecraftBlock[]) => {
        setBlocks(blocks);
    }

    const minecraftStructure = {
        blocks: blocks,
    }

    // const {data: blueprintList} = useBlueprintListAPI();
    const {state: {blueprints}, actions: {onBlueprintDelete, onBlueprintEdit, onBlueprintCollaborationStart}} = useBlueprintTable();

    const {
        collaborationSessions, onSessionResume, onSessionDelete,
    } = useCollaborationSessionTable();

    return (
        <div className="App">
        <NavigationBar/>
        <PageContent>
            <FlexStartColumn>
                <BlueprintTable 
                        blueprints={
                            blueprints
                        }
                        onBlueprintDelete={onBlueprintDelete}
                        onBlueprintEdit={onBlueprintEdit}
                        onBlueprintCollaborationStart={onBlueprintCollaborationStart}
                    />
                <CollaborationSessionTable
                    sessions={collaborationSessions}
                    onSessionResume={onSessionResume}
                    onSessionDelete={onSessionDelete}
                />
            </FlexStartColumn>
        </PageContent>
        </div>
    )
}