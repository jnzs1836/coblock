// useApi.ts
import { useState, useEffect } from "react";
import useSWR from "swr";

interface ParticipantTask {
    participant: number;
    taskId: number;
    experiment: number;
    isCompleted: boolean;
    feedbackReceived: boolean;
    feedbackCompleted: boolean;
    link: string
}

interface ApiData {
    userId: string;
    taskPool: number;
    assignedTasks: ParticipantTask[];
}

interface ParticipantStatus {
    status: boolean;
    codes: Array<string | null>;
}

export function getCookie(name: string) {
    const cookieArray = document.cookie.split(';');
  
    for (let i = 0; i < cookieArray.length; i++) {
      let cookie = cookieArray[i].trim();
      if (cookie.startsWith(name + '=')) {
        return cookie.substring(name.length + 1);
      }
    }
    return null;

  }
  

function processResponse(responseResult: any) {
    return {
        userId: responseResult.user_id,
        taskPool: responseResult.task_pool,
        assignedTasks: responseResult.assigned_tasks.map((task: any) => {
            return {
                taskId: task.id,
                participant: task.participant,
                experiment: task.experiment,
                isCompleted: task.is_completed,
                assignedTasks: task.is_feedback_received,
                feedbackReceived: task.is_feedback_received,
                link: task.link,
                feedbackCompleted: task.is_feedback_completed
            };
        }
        )
    };

}
export const useApi = (code: string | undefined) => {
    const [data, setData] = useState<ApiData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if(!code){
            return;
        }
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/participant/?pool_id=${code}`);
                const result = await response.json();
                let processedResult = processResponse(result);
                if (response.ok) {
                    setData(processedResult);
                } else {
                    setError(result.message || "An error occurred");
                }
            } catch (error) {
                // @ts-ignore
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        const intervalId = setInterval(() => {
            fetchData();
        }, 30000); // 30000 milliseconds = 30 seconds

        // Initialize WebSocket
        let socketURL = `ws://${window.location.host}/ws/participant`;
        console.log(socketURL);
        const ws = new WebSocket(`ws://${window.location.host}/ws/participant/`);

        ws.onopen = () => {
            console.log("WebSocket is open now.");
        };

        ws.onmessage = (e) => {
            const { message, status, task_id } = JSON.parse(e.data);
            console.log(`Message: ${message}, Status: ${status}, Task ID: ${task_id}`);

            // Update task state
            if (data && status === true) {
                const updatedTasks = data.assignedTasks.map((task) => {
                    if (task.experiment === task_id) {
                        return { ...task, is_completed: true };
                    }
                    return task;
                });

                setData({ ...data, assignedTasks: updatedTasks });
            }
        };

        ws.onerror = (e) => {
            console.error(`WebSocket error observed: `, e);
        };

        ws.onclose = () => {
            console.log("WebSocket is closed now.");
        };

        return () => {
            // ws.close();
            clearInterval(intervalId);
        };
    }, [code]);

    return { data, loading, error,  };
};


export function useParticipantStatus (code: string | undefined){

    const {data} = useSWR(`/api/pstatus/`, (url) => fetch(url).then((res) => res.json()));

    console.log(data);
    return {data: {
        status: data?.status,
        codes: data?.hit_codes as Array<string | null>
    } as ParticipantStatus}
}

