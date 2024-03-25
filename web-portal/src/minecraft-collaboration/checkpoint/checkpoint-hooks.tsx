import { MinecraftCollaborationCheckpoint, MinecraftWorldState } from "../../types/minecraft";
import useSWR from 'swr'
import { useAuthHeader } from 'react-auth-kit';
import { useEffect, useState } from "react";
import { MinecraftCollaborationSession } from '../../types/task';


interface CollaborationCheckpointHookState {
    checkpoints: MinecraftCollaborationCheckpoint[];
};

interface CollaborationCheckpointHookActions {
    onSave: (name: string, state: MinecraftWorldState) => void;
    onLoad: (checkpoint: MinecraftCollaborationCheckpoint) => void;
}

interface UseActionRequestProps<T> {
    // initialValue: T;
    action: (item: T) => Promise<void>;
}

enum ActionRequestState {
    IDLE,
    PENDING,
    SUCCESS,
    ERROR
}
function useActionRequest<T extends unknown>({ action }: UseActionRequestProps<T>) {
    const [queue, setQueue] = useState<Array<T>>([]);
    const [executedNumber, setExcutedNumber] = useState<number>(-1);
    const [status, setStatus] = useState<ActionRequestState>(ActionRequestState.IDLE);
    useEffect(() => {
        if (status === ActionRequestState.IDLE) {
            if (queue.length > executedNumber + 1) {
                setStatus(ActionRequestState.PENDING);
                action(queue[executedNumber + 1]).then(() => {
                    setExcutedNumber(executedNumber + 1);
                    setStatus(ActionRequestState.SUCCESS);
                }).catch(() => {
                    setStatus(ActionRequestState.ERROR);
                });
            }
        } else if (status === ActionRequestState.SUCCESS) {
            setStatus(ActionRequestState.IDLE);
        }


    }, [queue, executedNumber, status, action]);


    return {
        queue,
        addToQueue: (item: T) => {
            setQueue((prev) => [...prev, item]);
        },
        status: status
    }
}

function useSaveCheckpointAPI() {
    const authHeader = useAuthHeader();

    const requestReturn = useActionRequest<{ url: string, formData: FormData }>({
        action: (item) => {
            return fetch(item.url,
                {
                    method: 'POST',
                    headers: {
                        // 'Content-Type': 'multipart/form-data; boundary=' + boundary,
                        'Authorization': authHeader()
                        // ...authHeader(),
                    },
                    body: item.formData,
                }
            ).then(r => r.json())
                .then((data) => console.log(data))
        }
    });
    return requestReturn;


}

function useCheckpointListAPI(collaborationSession?: MinecraftCollaborationSession) {
    const authHeader = useAuthHeader();

    const fetcher = (url: string) => fetch(url,
        {
            method: 'GET',
            headers: {
                // 'Content-Type': 'multipart/form-data; boundary=' + boundary,
                'Authorization': authHeader()
                // ...authHeader(),
            },
        }
    ).then(r => r.json())
    const { data, error, isLoading } = useSWR(`/api/checkpoint/?session_id=${collaborationSession ? collaborationSession.id : -1}`, fetcher);
    const dataAsCheckpointList = data as Array<MinecraftCollaborationCheckpoint>;

    return { data: dataAsCheckpointList, error, isLoading }
}

export function useCollaborationCheckpoint(
    worldLoadState: (state: MinecraftWorldState) => void,
    collaborationSession?: MinecraftCollaborationSession
) {
    const { data: checkpoints } = useCheckpointListAPI(collaborationSession)

    const state: CollaborationCheckpointHookState = {
        checkpoints: checkpoints ? checkpoints : [],
    };

    const { addToQueue, status } = useSaveCheckpointAPI();

    const actions: CollaborationCheckpointHookActions = {
        onSave: (name: string, state: MinecraftWorldState) => {
            if (collaborationSession) {
                const formData = new FormData();
                formData.append('name', name);
                formData.append('state', JSON.stringify(state));
                formData.append('session_id', collaborationSession.id);
                addToQueue({
                    url: `/api/checkpoint/`,
                    formData
                });
            }
        },
        onLoad: (checkpoint: MinecraftCollaborationCheckpoint) => {
            worldLoadState(checkpoint.state);
        },
    };
    return { state, actions };

}