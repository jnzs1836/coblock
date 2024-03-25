import React, { useEffect, useState } from "react";
import { RequestProps, RequestState } from './types';
import { useAuthHeader } from 'react-auth-kit';


// hooks.tsx
// Contains the hooks used for web connection
// These hooks are used to make API requests and handle responses

function useGetAPI<T>(url: string, enabled: boolean, postprocess: (res: any) => T) {
    const authHeader = useAuthHeader();
    const authHeaderContent = authHeader();;
    const [response, setResponse] = useState<T>();
    const [status, setStatus] = useState<RequestState>(RequestState.IDLE);
    const [externalIndicator, setExternalIndicator] = useState<number>(0);
    

    useEffect(() => {
        if (enabled) {
            setStatus(RequestState.LOADING);
            fetch(url, {
                method: "GET",
                headers: {
                    "Authorization": authHeaderContent,
                    // "Content-Type": "application/json"
                }
            }).then((res) => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error("Failed to fetch");
                }
            }).then((res) => {
                setResponse(postprocess(res));
                setStatus(RequestState.SUCCESS);
            }).catch(() => {
                setStatus(RequestState.ERROR);
            });
        } else {
            setStatus(RequestState.DISABLED);
        }
    }, [url, enabled, authHeaderContent, externalIndicator]);
    const externalUpdate = () => {
        setExternalIndicator(prev => prev + 1);
    }

    const updateDataClientSide = setResponse;
    return { result: response, status: status, updateDataClientSide, externalUpdate };
}


function useGetListAPI<T>(url: string, enabled: boolean, postprocessItem: (res: any) => T) {
    const postprocess = (res: any) => {
        return res.map((item: any) => postprocessItem(item));
    }
    const response = useGetAPI<Array<T>>(url, enabled, postprocess);
    return {
        ...response,
        result: response.result || []
    }
}

interface UseActionRequestProps<T> {
    // initialValue: T;
    action: (item: T) => Promise<void>;
}



function useActionQueueRequest<T extends unknown>({ action }: UseActionRequestProps<T>) {
    const [queue, setQueue] = useState<Array<T>>([]);
    const [executedNumber, setExcutedNumber] = useState<number>(-1);
    const [status, setStatus] = useState<RequestState>(RequestState.IDLE);

    useEffect(() => {
        if (status === RequestState.IDLE) {
            if (queue.length > executedNumber + 1) {
                setStatus(RequestState.LOADING);
                action(queue[executedNumber + 1]).then(() => {
                    setExcutedNumber(executedNumber + 1);
                    setStatus(RequestState.SUCCESS);
                }).catch(() => {
                    setStatus(RequestState.ERROR);
                });
            }
        } else if (status === RequestState.SUCCESS) {
            setStatus(RequestState.IDLE);
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


const useActionRequest = (
    props: RequestProps
) => {
    const authHeader = useAuthHeader();
    const [status, setStatus] = useState<RequestState>(RequestState.IDLE);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const doRequest = async (url: URL | string, body: FormData, returnJson = true) => {
        setStatus(RequestState.LOADING);
        return fetch(url, {
            method: props.method,
            headers: {
                'Authorization': authHeader()
                // ...authHeader(), 
            },
            body: body
        }).then((res) => {
            if (res.ok) {
                setStatus(RequestState.SUCCESS);
                if (returnJson) {
                    return res.json();
                }
                return res;
            } else {
                setStatus(RequestState.ERROR);
                setErrorMessage(res.statusText);
            }
        });

    };
    return {
        doRequest, errorMessage, status
    }
}


function useRequestWrapper<T>(requestFunc: (...args: any[]) => Promise<T>, enabled: boolean) {
    const [status, setStatus] = useState<RequestState>(RequestState.IDLE);
  
    const wrappedRequestFunc = async (...args: any[]) => {
      if (enabled) {
        setStatus(RequestState.LOADING);
        try {
          const res = await requestFunc(...args);
        //   @ts-ignore
          if(res.ok){
            setStatus(RequestState.SUCCESS);
          }else{
            setStatus(RequestState.ERROR);
          }
          return res;
        } catch (error) {
          setStatus(RequestState.ERROR);
        }
      }
    };
  
    return {wrappedRequestFunc, status, setStatus};
  }

function useRequestConfirmDialogueWrapper<T> (
    requestFunc: (...args: any[]) => Promise<T>, enabled: boolean, postEffect: ()=> void
) {
    const [storedArgs, setStoreArgs] = useState<any []> ([]);
    const {
        wrappedRequestFunc, status, setStatus
    } = useRequestWrapper<T>(requestFunc, enabled);
    const [showConfirmDialogue, setShowConfirmDialogue] = useState<boolean>(false);
    const onDialogueClose = () => {
        setStatus(RequestState.IDLE);
        setShowConfirmDialogue(false);
    };
    
    const openConfirmDialogue = (...args: any[]) => {
        setStoreArgs(args);
        setShowConfirmDialogue(true);
    };

    const confirm = () => {
        wrappedRequestFunc(...storedArgs).then(() => {
            postEffect();
        });
    };

    return {showConfirmDialogue, setShowConfirmDialogue, wrappedRequestFunc, status, onDialogueClose, openConfirmDialogue, confirm};

}


export { useActionRequest, useActionQueueRequest, useGetAPI, useGetListAPI, useRequestWrapper, useRequestConfirmDialogueWrapper };