import React from 'react';
import logo from './logo.svg';
import '../App.css';
import NavigationBar from '../page/navigation-bar';
import PageContent from '../page/page-content';
import MinecraftViewerContainer from '../minecraft-viewer/minecraft-viewer-container';
// import styled from '@emotion/styled';
import { styled } from "@mui/material"
import MinecraftEditor from '../minecraft-editor/minecraft-editor';
import { MinecraftBlock, MinecraftCollaborationCheckpoint } from '../types/minecraft';
import { useParams } from 'react-router-dom';
import { useGetAPI } from '../web/hooks';
import { useRecordGet } from '../minecraft-collaboration/record/record-hooks';
import { useReplay } from '../replay/hooks';
import ReplayController from '../replay/replay-controller';
import ActionDisplayContainer from '../replay/action-display/action-display-container';
import { useMinecraftWorld } from '../minecraft-collaboration/hooks';
import { StyledCard, StyledCardContent } from '../page/styled-components';


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

function CollaborationReplayPage() {

    const { recordId } = useParams();
    const [blocks, setBlocks] = React.useState<Array<MinecraftBlock>>([]);
    // const {blueprint} = useMinecraftBlueprint();
    const syncWorldBlocks = (blocks: MinecraftBlock[]) => {
        setBlocks(blocks);
    }

    const { result: record } = useRecordGet(recordId);

    const { step, speed, autoPlay, action, next, previous, speedUp, speedDown, toggleAutoPlay, setStep, playedActions, currentBlocks } = useReplay(record);
    const totalSteps = record ? record.actionHistory.length : 5;
    return (
        <div className="App">
            <NavigationBar />
            <PageContent
                sx={{
                    paddingBottom: '3rem',
                    flexWrap: "wrap",
                }}
            >

                <Column
                    sx={{
                        flexGrow: 3
                    }}
                >

                    <MinecraftViewerContainer
                        sx={{ marginBottom: 2 }}
                        blocks={currentBlocks}
                    />
                    <StyledCard>
                        <StyledCardContent
                            sx={{
                                paddingTop: "15px"
                            }}
                        >
                            <ReplayController
                                progress={(step / totalSteps) * 100}
                                step={step}
                                totalSteps={totalSteps}
                                speed={speed}
                                autoPlay={autoPlay}
                                setStep={setStep}
                                next={next}
                                previous={previous}
                                speedUp={speedUp}
                                speedDown={speedDown}
                                toggleAutoPlay={toggleAutoPlay}
                                actionHistory={record?.actionHistory || []}

                            />

                        </StyledCardContent>
                    </StyledCard>

                </Column>

                <Column
                    sx={{
                        marginRight: '1rem',
                        flexBasis: "320px",
                        flexGrow: 1,


                    }}
                >

                    <ActionDisplayContainer
                        step={step}
                        actionHistory={record?.actionHistory || []}
                    />

                </Column>
            </PageContent>
        </div>
    )
}

export default CollaborationReplayPage;