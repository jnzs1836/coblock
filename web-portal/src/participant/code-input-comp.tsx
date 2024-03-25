import React, { useState } from 'react';
import { TextField, Button, Container, Grid } from '@mui/material';
import { styled } from '@mui/system';
import { RequestStatus } from '../chatgpt/chatgpt-hooks';
import { RequestState } from '../web/types';

const CustomTextField = styled(TextField)({
    '& .MuiOutlinedInput-root': {
        height: '48px',
    },
});

const CustomButton = styled(Button)({
    height: '48px',
});

interface Props {
    code: string | undefined;
    setCode: React.Dispatch<React.SetStateAction<string|undefined>>;
    onSubmit: (value: string) => void;
    status: RequestState;
}

export const CodeInput = ({ code, setCode, onSubmit, status }: Props) => {
    const [inputContent, setInputContent] = useState<string>('');
    const handleSubmit = () => {
        // Do something with the code, e.g., send it to the server
        console.log(`Submitted code: ${inputContent}`);
        onSubmit(inputContent);
    };

    return (
        <Container>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={9}>
                    <CustomTextField
                        fullWidth
                        disabled={code !== undefined || status === RequestState.LOADING}
                        label="Enter Code"
                        variant="outlined"
                        value={code  || inputContent}
                        onChange={(e) => setInputContent(e.target.value)}
                    />
                </Grid>
                <Grid item xs={3}>
                    <CustomButton
                        fullWidth
                        disabled={code !== undefined || status === RequestState.LOADING || inputContent.length === 0}
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                    >
                        Submit
                    </CustomButton>
                </Grid>
            </Grid>
        </Container>
    );
};
