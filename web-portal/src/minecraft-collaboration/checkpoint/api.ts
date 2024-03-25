import { MinecraftCollaborationCheckpoint, MinecraftWorldState } from "../../types/minecraft"
import { MinecraftCollaborationSession } from "../../types/task";


export function saveCheckpointAPI(auth: string, name: string, collaborationSession: MinecraftCollaborationSession, state:  MinecraftWorldState){
    const url = "/api/checkpoint/"
    
    const formData = new FormData();
    formData.append('name', name);
    formData.append('state', JSON.stringify(state));
    formData.append('session_id', collaborationSession.id);
    // formData.append('blueprint_id', "1");
    return fetch(url,
        {
            method: 'POST',
            headers: {  
                'Authorization': auth
                // ...authHeader(),
            },
            body: formData,
        }
    ).then((res) => {
        return res
    })
}