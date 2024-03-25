import { StyledCard } from "../../page/styled-components";
import { FormControl, MenuItem, Select, InputLabel } from "@mui/material";
import { usePromptCheckpointList } from "./hooks";
import { PromptCheckpoint } from "../../types/prompt";
import { useState } from "react";


interface Props {
  sx?: Record<string, any>;
  promptCheckpointList: PromptCheckpoint[];
  selectedCheckpoint: string | undefined;
  setSelectedCheckpoint: (value: string | undefined) => void;
}

export default function PromptCheckpointPanel({ sx, promptCheckpointList,
  selectedCheckpoint, setSelectedCheckpoint
}: Props) {

  // const {result: promptCheckpointList} = usePromptCheckpointList();

  // const [selectedCheckpoint, setSelectedCheckpoint] = useState<string | undefined>(undefined);

  const handleCheckpointChange = (checkpointId: string) => {
    setSelectedCheckpoint(checkpointId);
  }
  return (
    <StyledCard

      sx={{
        // paddingTop: "16px",
        ...sx
      }}
    >
      <FormControl fullWidth>
        <InputLabel>Prompt Select</InputLabel>
        <Select
          value={undefined}
          onChange={(e) => {
            handleCheckpointChange(e.target.value as string)
          }
          }
        >
          {promptCheckpointList.map((checkpoint: PromptCheckpoint) => (
            <MenuItem key={checkpoint.id} value={checkpoint.id}>
              {checkpoint.id}:{checkpoint.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </StyledCard>
  )

}