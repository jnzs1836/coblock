// types.ts
// types for the web request

enum RequestState {
    IDLE = "idle",
    LOADING = "loading",
    SUCCESS = "success",
    DISABLED = "disabled",
    READY = "ready",
    ERROR = "error",
}

interface RequestProps {
    // url: URL,
    method: string,
    // body: FormData | undefined,
}

export type { RequestProps}
export { RequestState }
