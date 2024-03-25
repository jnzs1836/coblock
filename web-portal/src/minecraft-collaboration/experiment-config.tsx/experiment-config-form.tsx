import React, { useState } from 'react';
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  styled,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import { ExperimentConfig, ExperimentMode, HumanMachineExperimentConfig, MachineOnlyExperimentConfig } from '../../types/experiment';
import { PromptCheckpoint } from '../../types/prompt';


const ConfigContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  padding: '1rem',
  border: '1px solid #ccc',
  borderRadius: '4px',
});

interface ExperimentConfigFormProps {
  experimentConfig: ExperimentConfig,
  onUpdateMode: (mode: ExperimentMode) => void;
  onUpdatePrompt: (prompt: PromptCheckpoint) => void;
  promptCheckpointList: Array<PromptCheckpoint>;
}

const ExperimentConfigForm: React.FC<ExperimentConfigFormProps> = ({
  experimentConfig,
  onUpdateMode,
  onUpdatePrompt,
  promptCheckpointList
}) => {
  const handleModeChange = (event: SelectChangeEvent<ExperimentMode>) => {
    const mode = event.target.value;
    onUpdateMode(mode as ExperimentMode);
  };


  const handlePromptVersionChange = (event: SelectChangeEvent<PromptCheckpoint>) => {
    const promptCheckpoint = event.target.value;
    onUpdatePrompt(promptCheckpoint as PromptCheckpoint);
  };

  return (
    <ConfigContainer>
      <FormControl>
        <InputLabel id="mode-label">Experiment Mode</InputLabel>
        <Select
          labelId="mode-label"
          id="mode-select"
          value={experimentConfig.mode}
          onChange={handleModeChange}
        >
          <MenuItem value={ExperimentMode.HumanMachine}>Human-Machine</MenuItem>
          <MenuItem value={ExperimentMode.MachineOnly}>Machine Only</MenuItem>
        </Select>
      </FormControl>
      {(experimentConfig.mode === ExperimentMode.HumanMachine || experimentConfig.mode === ExperimentMode.MachineOnly) && (
        <FormControl>
          <InputLabel id="mode-label">Experiment Mode</InputLabel>
          <Select
            labelId="mode-label"
            id="mode-select"
            value={experimentConfig.prompt}
            onChange={handlePromptVersionChange}
          >
            {
              promptCheckpointList.map(prompt => {
                return (
                  <MenuItem value={prompt.id}>{prompt.id}: {prompt.name}</MenuItem>
                )
              })
            }
          </Select>
        </FormControl>

      )}
      <button>Submit</button>
    </ConfigContainer>
  );
};

export default ExperimentConfigForm;
