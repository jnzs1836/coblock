import { useEffect, useState } from "react";
import { PromptCheckpoint } from "../types/prompt";
import { MinecraftCollaborationSession } from "../types/task";


interface BatchRecordLog {
    sessionIndices: string[],
    records: string[],
}
export function useBatchLogger (recordId: string | undefined, collaborationSession: MinecraftCollaborationSession | undefined, 
    // promptCheckpoint: PromptCheckpoint, batchVersion: string, batchName: string
    ){
    const [batchLog, setBatchLog] = useState<BatchRecordLog>({
        sessionIndices: [],
        records: []
    });
    


    useEffect(() => {
        setBatchLog(
            prev => {
                if(!recordId){
                    return prev;
                }
                if(prev){
                    return {
                        sessionIndices: [...prev?.sessionIndices, collaborationSession?.id || ""],
                        records: [...prev?.records, recordId]
                    }

                }else{
                    return {
                        sessionIndices: [collaborationSession?.id || ""],
                        records: [recordId]
                    }
                }
            }
        )
    }, [collaborationSession]);

    return {
        batchLog, setBatchLog
    }
}

export type {BatchRecordLog};