import React from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { MinecraftTaskAgentSpec, MinecraftTaskSpec , TaskWorkLoadType, TaskMotiveType, TaskSkillsetType} from "../../types/task";
interface TaskSpecConfigProps {
  taskSpec: MinecraftTaskSpec;
  setTaskSpec: React.Dispatch<React.SetStateAction<MinecraftTaskSpec>>;
}

const TaskSpecConfig: React.FC<TaskSpecConfigProps> = ({
  taskSpec,
  setTaskSpec,
}) => {
  const handleSpecChange = (
    field: keyof MinecraftTaskSpec,
    value: string
  ) => {
    setTaskSpec((prevSpec) => ({ ...prevSpec, [field]: value }));
  };

  return (
    <>
      <FormControl fullWidth>
        <InputLabel>Workload Type</InputLabel>
        <Select
          value={taskSpec.workLoadType}
          onChange={(e) =>
            handleSpecChange("workLoadType", e.target.value as string)
          }
        >
          {Object.values(TaskWorkLoadType).map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
        </FormControl>
        <FormControl fullWidth>
        <InputLabel>Skillset</InputLabel>
        <Select
          value={taskSpec.skillsetType}
          onChange={(e) =>
            handleSpecChange("skillsetType", e.target.value as string)
          }
        >
          {Object.values(TaskSkillsetType).map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
        

            </FormControl>
        <FormControl fullWidth>
        <InputLabel>Motive</InputLabel>
        <Select
          value={taskSpec.motiveType}
          onChange={(e) =>
            handleSpecChange("motiveType", e.target.value as string)
          }
        >
          {Object.values(TaskMotiveType).map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {/* Add similar form controls for other spec fields */}
    </>
  );
};

export default TaskSpecConfig;
