import React, { useState } from 'react';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Switch,
  TextField,
} from '@mui/material';
import LoadingProgress from '../../page/loading-progress';
import { useRequestWrapper } from '../../web/hooks';
import { FeedbackType } from './types';

interface FeedbackDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (feedback: string, isSuccess: boolean) => Promise<Response>;
  feedbackType?: FeedbackType
}
function generateRandomString(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
}
const FeedbackDialog: React.FC<FeedbackDialogProps> = ({
  open,
  onClose,
  onSubmit,
  feedbackType = FeedbackType.FAIL,

}) => {
  const [feedback, setFeedback] = useState('');
  const [isSuccess, setIsSuccess] = useState(true);

  const [completeCode, setCompleteCode] = useState<string>("");

  const handleFeedbackChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFeedback(event.target.value);
  };

  const handleSuccessChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsSuccess(event.target.checked);
  };

  
  const {
    wrappedRequestFunc, status 
  } = useRequestWrapper(() => onSubmit(feedback, feedbackType===FeedbackType.SUCCESS), true)  
  const handleSubmit = async () => {
    return wrappedRequestFunc().then(res => {
      return res?.json();
    }).then(res => {
      console.log(res.complete_code);
      setCompleteCode(res.complete_code)
    })
    // setFeedback('');
    // setIsSuccess(true);
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Feedback</DialogTitle>
      <DialogContent
        sx={{
          width: '500px',
        }}
      >
        <TextField
          multiline
          rows={4}
          variant="outlined"
          label="Feedback"
          value={feedback}
          onChange={handleFeedbackChange}
          fullWidth
          margin="normal"
        />
        <FormControlLabel
          control={
            <Switch
              checked={feedbackType === FeedbackType.SUCCESS}
              onChange={handleSuccessChange}
              color="primary"
            />
          }
          label={feedbackType === FeedbackType.SUCCESS ? 'Task is completed' : 'Task cannot be completed'}
        />
      </DialogContent>
      {
        feedbackType === FeedbackType.FAIL && <Alert
          severity="warning"
          sx={{
            width: '500px',
          }}
          >
            By submitting the form, you are confirming that the task is not possible to complete. We will manually check the task process and pay you if true. Otherwise, you will not receive the payment.
          </Alert>
      }
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button onClick={handleSubmit} color="primary">
          Submit
        </Button>
      </DialogActions>
      <LoadingProgress
        successMessage={'Submitted successfully. Please go back the home page!'}
        errorMessage={'Failed to submit and please try again. If you still cannot submit the result, please take a note of the error code below and paste it in the Amazon Mechnical Turk HIT.\n' + generateRandomString(10) }
       status={status} />
    </Dialog>
  );
};

export default FeedbackDialog;
