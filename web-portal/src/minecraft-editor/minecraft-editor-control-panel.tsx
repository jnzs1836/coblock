import { StyledCard, StyledCardContent, StyledCardHeader } from "../page/styled-components";
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import styled from "@emotion/styled";
import { CardContent } from "@mui/material";
import { SaveResponse } from "./editor-control";
interface MetaData {
    name: string;
    description: string;
}

interface MinecraftEditorControlPanelProps {
    sx?: Record<string, any>;
    onSave: () => Promise<SaveResponse>;
    onLoad: () => void;
    onRestart: () => void;
    onSetName: (name: string) => void;
    onSetDescription: (description: string) => void;
    name: string;
    description: string;

}

const MyButtonGroup = styled("div")(
    {
        display: "flex",
        justifyContent: "space-between",
        "& > *": {
            margin: "0 5px",
        },
    },

)

const PanelContent = StyledCardContent;

// const PanelContent = styled(CardContent)(
//     {
//         display: "flex",
//         flexDirection: "column",
//         justifyContent: "space-between",
//         "& > *": {
//             margin: "0 2px",
//         },
//         paddingLeft: "1.5rem",
//         paddingRight: "1.5rem",
//     },
// )

const CustomTextField = styled(TextField)({
    '& .MuiInputBase-input': {
        fontSize: '1rem', // set font size here
        fontFamily: 'Roboto', // set font family here
    },
});

export default function MinecraftEditorControlPanel({ sx, onSave, onLoad, onRestart, onSetDescription, onSetName, name, description }: MinecraftEditorControlPanelProps) {

    const [metadata, setMetadata] = useState<MetaData>({ name: '', description: '' });
    const [isLoadDialogOpen, setIsLoadDialogOpen] = useState(false);
    const [isRestartDialogOpen, setIsRestartDialogOpen] = useState(false);
    const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
    const [isSaveSuccessDialogOpen, setIsSaveSuccessDialogOpen] = useState(false);
    const [saveSuccessMessage, setIsSaveSuccessMessage] = useState<string>("");

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onSetName(event.target.value);
    };

    const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onSetDescription(event.target.value);
    };

    const handleSave = () => {
        if(!name || !description) {
            setIsSaveDialogOpen(true);
            return;
        }else{
            onSave().then((res) => {
                setIsSaveSuccessMessage(res.message);
                if (res.success) {
                    setIsSaveSuccessMessage("Saved!");
                    setIsSaveSuccessDialogOpen(true);
                }else{
                    setIsSaveSuccessDialogOpen(true);
                }

            });

        }
    };

    const handleLoad = () => {
        onLoad();
        setIsLoadDialogOpen(false);
    };

    const handleRestart = () => {
        onRestart();
        setIsRestartDialogOpen(false);
        setMetadata({ name: '', description: '' });
    };

    const handleLoadDialogClose = () => {
        setIsLoadDialogOpen(false);
    };

    const handleRestartDialogClose = () => {
        setIsRestartDialogOpen(false);
    };

    const handleLoadButtonClick = () => {
        setIsLoadDialogOpen(true);
    };

    const handleRestartButtonClick = () => {
        setIsRestartDialogOpen(true);
    };

    const handleSaveAlertClose = () => {
        setIsSaveDialogOpen(false);
    };

    const handleSaveSuccessAlertClose = () => {
        setIsSaveSuccessDialogOpen(false);
    };


    return (
        <StyledCard
            sx={{
                marginBottom: "1rem",
                paddingBottom: "1rem",
            }}
        >
            <StyledCardHeader title={"Editor Control"} />
            <PanelContent>

                <TextField
                    label="Name"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    value={name}
                    onChange={handleNameChange}
                    size="small"

                    sx={{
                        marginBottom: 0,
                    }}

                />
                <TextField
                    label="Description"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    multiline
                    rows={2}
                    value={description}
                    onChange={handleDescriptionChange}
                    size="small"
                    sx={{
                        marginBottom: "1rem",
                    }}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ color: 'primary' }}

                />
                <MyButtonGroup>
                    <Button variant="outlined"
                        sx={{ flexGrow: 1, marginRight: "5px" }}
                        onClick={handleLoadButtonClick}>
                        Load
                    </Button>
                    <Button variant="outlined" sx={{ flexGrow: 1 }} onClick={handleRestartButtonClick}>
                        Restart
                    </Button>
                    <Button variant="outlined" sx={{ flexGrow: 1, marginLeft: "5px" }} onClick={handleSave}>
                        Save
                    </Button>
                </MyButtonGroup>
                <Dialog open={isLoadDialogOpen} onClose={handleLoadDialogClose}>
                    <DialogTitle>Select a structure to load</DialogTitle>
                    {/* TODO: Implement structure list */}
                    <DialogActions>
                        <Button onClick={handleLoad}>Load</Button>
                        <Button onClick={handleLoadDialogClose}>Cancel</Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={isRestartDialogOpen} onClose={handleRestartDialogClose}>
                    <DialogTitle>Are you sure you want to restart?</DialogTitle>
                    <DialogActions>
                        <Button onClick={handleRestart}>Yes</Button>
                        <Button onClick={handleRestartDialogClose}>No</Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={isSaveDialogOpen} onClose={handleSaveAlertClose}>
                    <DialogTitle>The name should be empty</DialogTitle>
                    <DialogActions>
                        <Button onClick={handleSaveAlertClose}>Close</Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={isSaveSuccessDialogOpen} onClose={handleSaveSuccessAlertClose}>
                    <DialogTitle>{saveSuccessMessage}</DialogTitle>
                    <DialogActions>
                        <Button onClick={handleSaveSuccessAlertClose}>Close</Button>
                    </DialogActions>
                </Dialog>
            </PanelContent>
        </StyledCard>
    )


}