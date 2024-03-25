// App.tsx
import React, { useEffect, useState } from "react";
import { Container, Button, List, ListItem, ListItemText, Typography, CircularProgress, Checkbox, Avatar, Stack } from "@mui/material";
import styled from "@mui/system/styled";
import { getCookie, useApi, useParticipantStatus } from "./api"; // Import the custom hook
import { CodeInput } from "./code-input-comp";
import { useRequestWrapper } from "../web/hooks";
import LoadingProgress from "../page/loading-progress";
import AssignmentIcon from '@mui/icons-material/Assignment';
import { deepOrange, green, grey, orange, yellow } from '@mui/material/colors';
import DoneIcon from '@mui/icons-material/Done';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import ExperimentResultMessage from "./experiment-result-message";
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
const CompleteButton = styled(Button)({
    backgroundColor: "#4CAF50",
    color: "white",
    "&:hover": {
        backgroundColor: "#45a049",
    },
});

const TaskStartButton = styled(Button)({
    backgroundColor: "#4CAF50",
    color: "white",
    "&:hover": {
        backgroundColor: "#45a049",
    },
    marginRight: "1rem",

});


const ParticipantHomeComp: React.FC = () => {
    const [code, setCode] = useState<string>(); // [1] Add a state variable to store the code;
    const { data, loading, error } = useApi(code);

    const {data: participantStatus} = useParticipantStatus(code);
    const {
        wrappedRequestFunc: wrapperCodeFetch, status: codeStatus,
    } = useRequestWrapper((codeValue: string) => {
        return fetch(`/api/participant/?pool_id=${codeValue}`);
    }, true);



    console.log("participantStatus", participantStatus);    
    let completeCode = participantStatus?.codes?.filter((code) => code !== null).join("") || "";

    const markTaskCompleted = async (taskID: number) => {
        // Update the task status in your backend server
        try {
            const response = await fetch(`/api/ptask/${taskID}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ is_completed: true }),
            });

            if (response.ok) {
                // Refresh the data or update the state to reflect the change
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
    };


    const generateRandomToken = () => {
        return Math.random().toString(36).substr(2, 9);
    };

    if (loading) return <CircularProgress />;
    if (error) return <Typography variant="h6">Error: {error}</Typography>;
    return (
        <Container 
        sx={{
            width: "680px"
        }}>
            <CodeInput
                code={code}
                status={codeStatus}
                setCode={setCode}
                onSubmit={(value: string) => {
                    // return wrapperCodeFetch(value)
                    return wrapperCodeFetch(value).then((res) => {
                        if (res?.ok) {
                            setCode(value);
                        }
                    });
                }
                }
            />
            <LoadingProgress
                status={codeStatus}
                errorMessage={"Faled! Please check the experiment code."}
                successMessage={"Success"}
            />
            {/* <Typography variant="h4" gutterBottom>
                Task List
            </Typography> */}

            {data && (
                <>
                    <List>
                        {data.assignedTasks.map((task, index) => (
                            <ListItem key={index}>
                                <ListItemText primary={`Experiment ID: ${task.taskId}`} />
                                

                                <TaskStartButton
                                    onClick={() => window.open(`/p/${task.link}`, '_blank', 'rel=noopener noreferrer')}>
                                    {
                                        !task.feedbackReceived ?
                                        "Start" : "Re-do"
                                    }
                                </TaskStartButton>
                                <Avatar sx={{ bgcolor: task.feedbackReceived? (task.feedbackCompleted? green[500]: orange[500]): grey[500] }} variant="rounded">
                                    {
                                        task.feedbackReceived?
                                        (task.feedbackCompleted ? <DoneIcon />: <PriorityHighIcon/>):
                                        <HorizontalRuleIcon />

                                    }
                                    
                                </Avatar>
                                {/* <CompleteButton
                                    disabled={task.isCompleted}
                                    onClick={() => markTaskCompleted(task.taskId)}
                                >
                                    {task.isCompleted ? "Completed" : "Mark as Complete"}
                                </CompleteButton> */}
                            </ListItem>
                        ))}
                    </List>

                    {/* {data.assignedTasks.every((task) => task.feedbackReceived) && (
                        <Typography variant="h6">
                            All tasks are completed. Your token is: {generateRandomToken()}
                        </Typography>
                    )} */}
                </>
            )}
            {code && <ExperimentResultMessage
                success={participantStatus.status}
                code={completeCode || ""}
                warning={!data?.assignedTasks.every((task) => task.feedbackCompleted)}

            />}
        </Container>
    );
};

export default ParticipantHomeComp;
