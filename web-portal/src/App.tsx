import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import NavigationBar from './page/navigation-bar';
import PageContent from './page/page-content';
import MinecraftViewerContainer from './minecraft-viewer/minecraft-viewer-container';
import styled from '@emotion/styled';
import MinecraftEditor from './minecraft-editor/minecraft-editor';
import { MinecraftBlock } from './types/minecraft';
import { generateUId } from './types/utils';
import ChatGPTPanel from './chatgpt/chatgpt-panel';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import StructureCreatorPage from "./pages/structure-creator-page";
import CollaborationPage from './pages/collaboration-page';
import ModelCollaborationPage from './pages/model-collaboration-page';
import DashboardPage from './pages/dashboard-page';

import LoginPage from './pages/login-page';
import PromptEditorPage from './pages/prompt-editor-page';
import { AuthProvider } from 'react-auth-kit';
import { RequireAuth } from 'react-auth-kit';
import StructureCreatorRedirectPage from './pages/structure-creator-redirect-page';
import TaskConfigPage from './pages/task-config-page';
import PromptTablePage from './pages/prompt-table-page';
import BatchExecutionPage from './pages/batch-execution-page';
import HumanCollaborationPage from './pages/human-collaboration-page';
import CollaborationReplayPage from './pages/collaboration-replay-page';
import TaskConfigEditPage from './pages/task-config-page-edit';
import SyncHumanCollaborationPage from './pages/sync-human-collaboration-page';
import ParticipantHomePage from './pages/participant-home-page';
import SyncParticipantPage from './pages/sync-participant-page';

// App.tsx
// Entrypoint file for the project
// Contains the main routing logic for the project
// This file is responsible for setting up the routes for the project
// It also sets up the AuthProvider for the project


const initialBlocks: MinecraftBlock[] = [
  { blockType: 'red', pos: { x: 0, y: 1, z: 2 }, uid: generateUId() },
  { blockType: 'green', pos: { x: 1, y: 2, z: 3 }, uid: generateUId() },
  // { blockType: 'blue', pos: { x: -1, y: 0, z: -1 } },
];

function App() {

  const [blocks, setBlocks] = React.useState<Array<MinecraftBlock>>(initialBlocks);

  const minecraftStructure = {
    blocks: blocks,
  }
  useEffect(() => {
    document.title = 'Block World'; // Set the new page title
  }, []);

  return (
    <AuthProvider authType={'cookie'}
      authName={'_auth'}
      cookieDomain={window.location.hostname}
      cookieSecure={window.location.protocol === "https:"}>

      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={<StructureCreatorPage />}/> */}
          {/* <Route index element={<StructureCreatorPage />}> */}

          <Route path='/login' element={<LoginPage />} />
          <Route path="/creator/:blueprintId" element={
            <RequireAuth loginPath={'/login'}>
              <StructureCreatorPage />
            </RequireAuth>
          } />
          <Route path="/creator/" element={
            <RequireAuth loginPath={'/login'}>
              <StructureCreatorRedirectPage />
            </RequireAuth>
          } />
          <Route path='/collaboration/:sessionId'
            element={
              <RequireAuth loginPath={'/login'}>
                <CollaborationPage />
              </RequireAuth>
            } />
          <Route path='/model-collaboration/:sessionId'
            element={
              <RequireAuth loginPath={'/login'}>
                <ModelCollaborationPage />
              </RequireAuth>
            } />
          <Route path='/task-config/'
            element={
              <RequireAuth loginPath={'/login'}>
                <TaskConfigPage />
              </RequireAuth>
            } />
          <Route path='/task-edit/:sessionId'
            element={
              <RequireAuth loginPath={'/login'}>
                <TaskConfigEditPage />
              </RequireAuth>
            } />

          <Route path='/'
            element={
              <RequireAuth loginPath={'/login'}>
                <DashboardPage />
              </RequireAuth>
            } />
          <Route path='/prompt-editor/:promptId'
            element={
              <RequireAuth loginPath={'/login'}>
                <PromptEditorPage />
              </RequireAuth>
            } />
          <Route path='/prompt-table'
            element={
              // <RequireAuth loginPath={'/login'}>
              <PromptTablePage />
              // </RequireAuth>
            } />
          <Route path='/batch-execution'
            element={
              <RequireAuth loginPath={'/login'}>
                <BatchExecutionPage />
              </RequireAuth>
            } />
          <Route path='/h/:linkId'
            element={
              <HumanCollaborationPage />
            } />
          <Route path='/s/:linkId'
            element={
              <SyncHumanCollaborationPage />
            } />
          <Route path='/replay/:recordId'
            element={
              <CollaborationReplayPage />
            } />
          <Route
            path='/participant'
            element={
              <ParticipantHomePage />
            }
          />
           <Route
            path='/p/:linkId'
            element={
              <SyncParticipantPage />
            }
          />

        </Routes>
      </BrowserRouter>

    </AuthProvider>


  );
}

export default App;
