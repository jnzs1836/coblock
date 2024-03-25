import { PromptCheckpoint } from "../types/prompt";
import { BatchRecordLog } from "./logger";


function saveBatchLog(batchLog: BatchRecordLog, batchName: string, backendVersion: string, promptCheckpoint: PromptCheckpoint | undefined, authHeader: () => string){
    let formData = new FormData();
    formData.append('spec', JSON.stringify({
        name: batchName,
        backendVersion: backendVersion,
        promptCheckpoint: promptCheckpoint,
        records: batchLog.records,
        sessionIndices: batchLog.sessionIndices,
    }));
    formData.append('name', batchName);
    return fetch(`/api/mbfdback/`, {
        method: 'POST',
        body: formData,
        headers: {
            // 'Content-Type': 'multipart/form-data; boundary=' + boundary,
            'Authorization': authHeader()
            // ...authHeader(),
        },
    });


}

export {saveBatchLog};