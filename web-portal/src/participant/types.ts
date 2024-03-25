interface ParticipantTask {
    link: string,
    completed: boolean,
    feedbackReceived: boolean,
}

interface ParticipantInfo {
    assignedTasks: ParticipantTask[]
}

export type {ParticipantInfo, ParticipantTask}