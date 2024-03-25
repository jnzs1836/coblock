import useSWR from 'swr'
import { useAuthHeader } from 'react-auth-kit';
import { MinecraftBlueprint } from '../types/minecraft';
import { useNavigate } from 'react-router-dom';
import { MinecraftTaskInstance } from '../types/task';

import { MinecraftCollaborationSession } from '../types/task';

function convertDataToCollaborationSession(rawData: any) {
    if (rawData) {
        let newData = rawData as MinecraftCollaborationSession;
        newData.config = rawData.task_config;
        
        return newData;
    } else {
        return rawData as MinecraftCollaborationSession;
    }
}

export const useCollaborationSessionListAPI = () => {

    const authHeader = useAuthHeader();

    const fetcher = (url: URL) => fetch(url,
        {
            method: 'GET',
            headers: {
                // 'Content-Type': 'multipart/form-data; boundary=' + boundary,
                'Authorization': authHeader()
                // ...authHeader(),
            },
        }
    ).then(r => r.json())
    const { data, error, isLoading } = useSWR('/api/collaboration/', fetcher);
    let dataAsSessionList = [];
    if (data) {
        dataAsSessionList = data.map(convertDataToCollaborationSession);
    }
    if (dataAsSessionList === undefined) {
        dataAsSessionList = [];
    }
    return { data: dataAsSessionList, error, isLoading }

}

export const useCollaborationSessionGetAPI = (sessionId: string) => {

    let fetcher = (url: URL) => fetch(url,
        {
            method: 'GET',
            headers: {
                // 'Content-Type': 'multipart/form-data; boundary=' + boundary,
                'Authorization': authHeader()
                // ...authHeader(),
            },
        }
    ).then(r => r.json())

    if (sessionId === undefined || sessionId === null || sessionId === '') {
        const formData = new FormData();
        // formData.append('spec', `{"blocks":[]}`);
        // formData.append('name', "");
        fetcher = (url: URL) => fetch(url,
            {
                method: 'POST',
                headers: {
                    // 'Content-Type': 'multipart/form-data; boundary=' + boundary,
                    'Authorization': authHeader()
                },
                body: formData,
            }
        ).then(r => r.json())
    } else {

    }

    const authHeader = useAuthHeader();

    const { data, error, isLoading } = useSWR(`/api/collaboration/${sessionId}/`, fetcher);
    const session = data as MinecraftCollaborationSession;

    return { data: session, error, isLoading }

}


export function convertCollaborationSessionListToTable(sessionList: Array<MinecraftCollaborationSession>) {
    const tableData = sessionList.map((session: MinecraftCollaborationSession) => {
        return {
            id: session.id,
            blueprint: session.blueprint,
            data: session,
            isValid: (session.config.agents !== undefined && session.config.agents[0].motives !== undefined) ?  "Valid" : "Invalid",
        }
    })
    return tableData;
}


export const useCollaborationSessionTable = () => {
    const { data: collaborationSessions, isLoading: isLoading, error: error } = useCollaborationSessionListAPI();
    const authHeader = useAuthHeader();
    const navigate = useNavigate();

    function onSessionResume(session: MinecraftCollaborationSession) {
        navigate(`/collaboration/${session.id}`);
    }

    function onSessionDelete(session: MinecraftCollaborationSession) {
        fetch(`/api/collaboration/${session.id}/`, {
            method: 'DELETE',
            headers: {
                // 'Content-Type': 'multipart/form-data; boundary=' + boundary,
                'Authorization': authHeader()
                // ...authHeader(),
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                return response.json();
            }
            )
            .then(data => {
            }
            )
            .catch(error => {
                console.log(error);
            }
            )
    }

    return {
        collaborationSessions,
        onSessionResume,
        onSessionDelete,
    }
}