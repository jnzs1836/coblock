import {useAuthHeader} from 'react-auth-kit'
import { useEffect, useState } from 'react';
import { MinecraftBlueprint, MinecraftStructure, MinecraftBlock } from '../types/minecraft';
import { useBlueprintGetAPI } from '../management/blueprint-management-hooks';

interface BlueprintManagementState {
    blueprintName: string;
    blueprintDescription: string;
    ready: boolean;
    structure: MinecraftStructure;
};

interface SaveResponse {
    success: boolean;
    message: string;
}

interface BlueprintManagementActions {
    onSaveBlueprint: () => Promise<SaveResponse>;
    onClearBlueprint: () => void;
    onSetName: (name: string) => void;
    onSetDescription: (description: string) => void;
    setBlocks: (blocks: Array<MinecraftBlock>) => void;
}


export const useBlueprintManagement = (blueprintId?: string) => {
    
    const authHeader = useAuthHeader();
    
    const [readyState, setReadyState] = useState<boolean>(false);

    
    const {data: initialBlueprint} = useBlueprintGetAPI(blueprintId? blueprintId: '1');

    const [blueprintName, setBlueprintName] = useState<string>(initialBlueprint? initialBlueprint.name:'');
    const [blueprintDescription, setBlueprintDescription] = useState<string>(initialBlueprint? initialBlueprint.description:'');
    const [structure, setStructure] = useState<MinecraftStructure>({blocks: []});
    useEffect(() => {
        if (initialBlueprint) {
            setBlueprintName(initialBlueprint.name);
            setBlueprintDescription(initialBlueprint.description);
            setStructure(initialBlueprint.spec as MinecraftStructure);
            setReadyState(true);

        }
    }, [initialBlueprint]);
    


    
    const spec = JSON.stringify(structure);
    const state: BlueprintManagementState = {
        blueprintName,
        blueprintDescription,
        ready: readyState,
        structure,
    };

    

    const actions: BlueprintManagementActions = {
        onSaveBlueprint: () => {
            const formData = new FormData();
            formData.append('spec', spec);
            formData.append('name', blueprintName);
            formData.append('description', blueprintDescription);
            return fetch(`/api/blueprint/${blueprintId}/`, {
                method: 'PUT',
                headers: {
                    // 'Content-Type': 'multipart/form-data; boundary=' + boundary,
                    'Authorization': authHeader()
                    // ...authHeader(),
                },
                body: formData,
            })
            .then(response => {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                return response.json();
            })
            .then(data => {
                return {
                    success: true,
                    message: data.message,
                }
            })
            .catch(error => {
                console.error(error);
                return {
                    success: false,
                    message: 'There was an error processing your request.',
                }
            });
            
        },
        onClearBlueprint: () => {
            setBlueprintName('');
            setBlueprintDescription('');
        },
        onSetName: (name: string) => {
            setBlueprintName(name);
        },
        onSetDescription: (description: string) => {
            setBlueprintDescription(description);
            setStructure({
                ...structure,
                desc: description,
            });
        },
        setBlocks: (blocks: Array<MinecraftBlock>) => {
            setStructure({blocks: blocks});
        }
    }
    return {
        state, actions
    }
}

export type {BlueprintManagementState, BlueprintManagementActions, SaveResponse}