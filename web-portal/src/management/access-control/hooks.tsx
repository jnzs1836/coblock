import { MinecraftBlueprint, BlueprintAccess } from "../../types/minecraft";
import useSWR from 'swr'
import {useAuthHeader} from 'react-auth-kit';
import { useNavigate } from 'react-router-dom';
import { MinecraftTaskInstance } from '../../types/task';
import { useEffect, useState } from "react";

function convertResponseToBlueprintAccess(response: any){
    let dataAsAccess = {
                ...response,
                canEdit: response.can_edit,
                canView: response.can_view,
                canManage: response.can_manage,
                collaboratorName: response.collaborator_name
            } as BlueprintAccess;
    return dataAsAccess
}

function convertResponseToBlueprintAccessList(response: any){
    let dataAsAccessList = (response.map((d: Record<string, any>) => ({
                ...d,
                canEdit: d.can_edit,
                canView: d.can_view,
                canManage: d.can_manage,
                collaboratorName: d.collaborator_name
            }))) as Array<BlueprintAccess>;
    return dataAsAccessList
}


const useBlueprintAccessListAPI = (blueprint: MinecraftBlueprint) => {

    const authHeader = useAuthHeader();
    const authHeaderValue = authHeader();
    // const fetcher = (url: URL) => fetch(url,
    //         {
    //             method: 'GET',
    //             headers: {
    //                 // 'Content-Type': 'multipart/form-data; boundary=' + boundary,
    //                 'Authorization': authHeader()
    //                 // ...authHeader(),
    //             },
    //         }
    //     ).then(r => r.json())
    // const { data: requestData, error, isLoading } = useSWR(`/api/blueprints/${blueprint.id}/collaborators/`, fetcher);


    let definedData = []; 
    // if(data === undefined) {
    //     definedData = [];
    // }else{
    //     definedData = data;
    // }



    const [data, setData] = useState<Array<BlueprintAccess>>([]);

    useEffect(() => {
        fetch(`/api/blueprints/${blueprint.id}/collaborators/`,
        {
            method: 'GET',
            headers: {
                'Authorization': authHeaderValue,
            },

        }).then(r => r.json()).then(d => {
            let dataAsAccessList = convertResponseToBlueprintAccessList(d);
            setData(dataAsAccessList);
        });

    }, []);

    const onUpdateAccessListRaw = (updatedAccessList: Array<BlueprintAccess>) => {
        let dataAsAccessList = convertResponseToBlueprintAccessList(updatedAccessList);
        setData(updatedAccessList);
    }

    const onDelete = (accessId: string) => {
        setData(data.filter((d: BlueprintAccess) => d.id !== accessId));
    }

    const onAddNewAccess = (newAccess: BlueprintAccess) => {
        setData([...data.filter(
            (d: BlueprintAccess) => d.id !== newAccess.id
        ), newAccess]);
    }
    
    return {data: data, onUpdateAccessListRaw, onDelete, onAddNewAccess}
}

const useBlueprintAccessControl = (blueprint: MinecraftBlueprint) => {

    

};

// const convertResponseToBlueprintAccess = (response: Record<string, any>): BlueprintAccess => {
//     return {
//         id: response.id,
//         canEdit: response.can_edit,
//         canView: response.can_view,
//         canManage: response.can_manage,
//         collaboratorName: response.collaborator_name,
//         collaborator: response.collaborator,
//     } as BlueprintAccess;
// }

// const updateBlueprintAccess(updatedAccess: BlueprintAccess) => {
    
//     fetch(url,
//             {
//                 method: 'GET',
//                 headers: {
//                     // 'Content-Type': 'multipart/form-data; boundary=' + boundary,
//                     'Authorization': authHeader()
//                     // ...authHeader(),
//                 },
//             }
//         ).then(r => r.json())
// }



export {useBlueprintAccessListAPI, convertResponseToBlueprintAccess};