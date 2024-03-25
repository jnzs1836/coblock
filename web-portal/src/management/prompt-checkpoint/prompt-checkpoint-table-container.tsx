import PromptCheckpointPanel from "./prompt-checkpoint-panel";
import PromptCheckpointTable from "./prompt-checkpoint-table";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { PromptCheckpoint } from "../../types/prompt";
import { usePromptCheckpointList } from "./hooks";
import { createNewPromptCheckpoint, deletePromptCheckpointAPI } from "./api";
import {useAuthHeader} from 'react-auth-kit';
import { useNavigate } from "react-router-dom";


const columns = [
  { Header: "ID", accessor: "id" },
  { Header: "Name", accessor: "name" },
  { Header: "Version", accessor: "version" },
    //  @ts-ignore
  { Header: "Tags", accessor: (row) => row.tags.map(d=>d.name).join(", ") }
];


interface Props {

}

export default function PromptCheckpointPanelContainer ({}: Props){
    const {result: promptCheckpoints, externalUpdate}= usePromptCheckpointList();
    // const [promptCheckpoints, setPromptCheckpoints] = useState<PromptCheckpoint[]>([]);

    const authHeader = useAuthHeader();
    const navigate = useNavigate();
    const onCreateNewPromptCheckpoint = () => {
        const emptyPromptCheckpoint: PromptCheckpoint = {
            id: "",
            name: "",
            messagePrefix: "",
            messageSuffix: "",
            promptMessage: "",
            version: "",
            tags: [],
        };
        return createNewPromptCheckpoint(emptyPromptCheckpoint, authHeader()).then((res)=>res.json()).then((response) => {
            // @ts-ignore
            let responseData = response;
            if(responseData && responseData.id){
                navigate(`/prompt-editor/${responseData.id}`);
            }
        });

        // setPromptCheckpoints([...promptCheckpoints, response.data]);
    }
    const onEditPromptCheckpoint = (promptCheckpointId: string) => {
        navigate(`/prompt-editor/${promptCheckpointId}`);
    }

    const onDeletePromptCheckpoint = (promptCheckpointId: string) => {
        return deletePromptCheckpointAPI(promptCheckpointId, authHeader())
    }
//   useEffect(() => {
//     const fetchPromptCheckpoints = async () => {
//       const response = await axios.get("/api/prompt-checkpoints/");
//       setPromptCheckpoints(response.data);
//     };
//     fetchPromptCheckpoints();
//   }, []);


    return (
        <PromptCheckpointTable
            data={promptCheckpoints}
            // @ts-ignore
            columns={columns}
            onCreateNewPromptCheckpoint={onCreateNewPromptCheckpoint}
            onEditPromptCheckpoint={onEditPromptCheckpoint}
            onDeletePromptCheckpoint={onDeletePromptCheckpoint}
            externalUpdate={externalUpdate}
        />
    )
}