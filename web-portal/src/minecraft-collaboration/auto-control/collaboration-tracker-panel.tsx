import { StyledCard, StyledCardContent, StyledCardHeader } from "../../page/styled-components";
import LinearProgress from '@mui/material/LinearProgress';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AutoModeIcon from '@mui/icons-material/AutoMode';
import { Avatar } from "@mui/material";
import { green, grey } from "@mui/material/colors";

interface Props {
    taskCompleted: boolean,
    progress: number
}

export default function CollaborationTrackerPanel({ taskCompleted, progress }: Props) {

    return (
        <StyledCard>
            <StyledCardHeader />
            <StyledCardContent
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    
                }}
            >
                <LinearProgress
                    sx={{
                        flexBasis: "100px",
                        flexGrow: "1",
                        marginRight: "25px"
                    }}
                variant="determinate" value={progress * 100} />
                
                {taskCompleted && <Avatar sx={{
                     bgcolor: green[500], 
                    //  flexBasis: "30px",
                     flexGrow: 0
                     }}>
                    <CheckCircleOutlineIcon/>    
                </Avatar>}
                {!taskCompleted && <Avatar 
                
                sx={{ 
                    flexBasis: "30px",
                     flexGrow: 0, 
                     bgcolor: grey[500] }}>
                    <AutoModeIcon/>
                </Avatar>}
            </StyledCardContent>
        </StyledCard>
    )

}