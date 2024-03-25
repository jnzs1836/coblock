import React from "react";
import { Box, Button, TextField } from "@mui/material";
import { MinecraftTaskInstance } from "../../types/task";
import TaskInventoryConfig from "./task-inventory-config";
import TaskAgentEditPanel from "./task-agent-edit-panel";
interface TaskAgentConfigPanelProps {
  taskInstance: MinecraftTaskInstance;
  setTaskInstance: React.Dispatch<React.SetStateAction<MinecraftTaskInstance>>;
}

const TaskAgentConfigPanel: React.FC<TaskAgentConfigPanelProps> = ({
  taskInstance,
  setTaskInstance,
}) => {
  const handleAgentRoleChange = (index: number, value: string) => {
    const updatedAgents = [...taskInstance.agents];
    updatedAgents[index].role = value;
    setTaskInstance((prevState) => ({ ...prevState, agents: updatedAgents }));
  };

  const addAgent = () => {
    setTaskInstance((prevState) => ({
      ...prevState,
      agents: [
        ...prevState.agents,
        {
          role: "",
          inventory: [],
          views: [],
          blueprint: undefined,
          name: "",
          motives: [],
        },
      ],
    }));
  };

  return (
    <>
      <Button onClick={addAgent} variant="outlined">
        Add Agent
      </Button>
      {taskInstance.agents.map((agent, index) => (
        <Box key={index}>
          <TextField
            label="Role"
            value={agent.role}
            onChange={(e) => handleAgentRoleChange(index, e.target.value)}
          />
          {/* Add form controls for inventory and views */}
        </Box>
      ))}
    </>
  );
};

export default TaskAgentConfigPanel;