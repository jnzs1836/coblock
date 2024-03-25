import useSWR from 'swr'
import {useAuthHeader} from 'react-auth-kit';
import { MinecraftBlueprint } from '../types/minecraft';
import { useNavigate } from 'react-router-dom';
import { MinecraftTaskInstance } from '../types/task';


export const useBlueprintListAPI = () => {

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
    const { data, error, isLoading } = useSWR('/api/blueprint/', fetcher);
    let dataAsBlueprintList = data as Array<MinecraftBlueprint>;
    if(dataAsBlueprintList === undefined) {
        dataAsBlueprintList = [];
    }
    return {data: dataAsBlueprintList, error, isLoading}

}

export const useBlueprintGetAPI = (blueprintId: string) => {

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

    if(blueprintId === undefined || blueprintId === null || blueprintId === '') {
        const formData = new FormData();
        formData.append('spec', `{"blocks":[]}`);
        formData.append('name', "");
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
    }else{
        
    }

    const authHeader = useAuthHeader();

    const { data, error, isLoading } = useSWR(`/api/blueprint/${blueprintId}`, fetcher);
    const blueprint = data as MinecraftBlueprint;
    
    return {data: blueprint, error, isLoading}

}


export const convertBlueprintListToTable = (blueprintList: Array<MinecraftBlueprint>) => {
    const table = blueprintList.map((blueprint) => {
        const colors = blueprint.spec.blocks.reduce((uniqueColors: Array<string>, block) => {
            if (!uniqueColors.includes(block.blockType)) {
              uniqueColors.push(block.blockType);
            }
            return uniqueColors;
          }, []);

        return {
            name: blueprint.name,
            description: blueprint.description,
            spec: blueprint.spec,
            blockCount: blueprint.spec.blocks.length,
            colors: colors,
            blueprint: blueprint,
        }
    });
    return table;
}

export const convertBlueprintListToTaskSelectTable = (blueprintList: Array<MinecraftBlueprint>,
        taskInstance: MinecraftTaskInstance
    ) => {
    const table = blueprintList.map((blueprint) => {
        const colors = blueprint.spec.blocks.reduce((uniqueColors: Array<string>, block) => {
            if (!uniqueColors.includes(block.blockType)) {
              uniqueColors.push(block.blockType);
            }
            return uniqueColors;
          }, []);
        return {
            name: blueprint.name,
            description: blueprint.description,
            spec: blueprint.spec,
            blockCount: blueprint.spec.blocks.length,
            colors: colors,
            blueprint: blueprint,
            taskUsage: {
                human: taskInstance.agents[0]? taskInstance.agents[0].blueprint?.id === blueprint.id : false,
                machine: taskInstance.agents[1]? taskInstance.agents[1].blueprint?.id === blueprint.id : false,
                blueprint: blueprint,
                baseBlueprint: taskInstance.baseBlueprint ? taskInstance.baseBlueprint.id === blueprint.id : false,
            }
        }
    });
    return table;
}


interface BlueprintTableState {
    blueprints: Array<MinecraftBlueprint>;
}

interface BlueprintTableActions {
    // onBlueprintSelected: (blueprint: MinecraftBlueprint) => void;
    onBlueprintDelete: (blueprint: MinecraftBlueprint) => void;
    onBlueprintEdit: (blueprint: MinecraftBlueprint) => void;
    onBlueprintCollaborationStart: (blueprint: MinecraftBlueprint) => void;
}




export const useBlueprintTable = () => {
    const {data: blueprints, isLoading: isBlueprintLoading, error: blueprintRequestError} = useBlueprintListAPI();
    const authHeader = useAuthHeader();
    const navigate = useNavigate();
    const state: BlueprintTableState = {
        blueprints: blueprints? blueprints : [],
    };

    const actions: BlueprintTableActions = {
        onBlueprintDelete(blueprint) {
            fetch(`/api/blueprint/${blueprint.id}`, {
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
        },
        onBlueprintEdit(blueprint) {
            navigate(`/creator/${blueprint.id}`, {state: {blueprint: blueprint}});
        },
        onBlueprintCollaborationStart(blueprint) {
            const formData = new FormData();
            formData.append("blueprint_id", blueprint.id);
            fetch(`/api/collaboration/`, {
                method: 'POST',
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
            }
            )
            .then(data => {
                navigate(`/collaboration/${data.id}`, {state: {blueprint: blueprint}});

            }
            )
            .catch(error => {
                console.log(error);
            }
            )

            // navigate(`/collaboration/${blueprint.id}`, {state: {blueprint: blueprint}});
        }
    }

    return {
        state: state,
        actions
    }
}
