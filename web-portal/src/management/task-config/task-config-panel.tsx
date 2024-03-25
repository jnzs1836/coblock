import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { styled } from "@mui/system";
import TaskSpecConfig from "./task-spec-config";
import BlueprintSelection from "./task-blueprint-select";
import TaskAgentConfigPanel from "./task-agent-config-panel";
import { TaskWorkLoadType, TaskMotiveType, TaskSkillsetType, MinecraftTaskSpec, MinecraftTaskInstance } from "../../types/task";
import {MinecraftBlueprint} from "../../types/minecraft";
import { StyledCard, StyledCardContent, StyledCardHeader } from "../../page/styled-components";
import TaskInventoryConfig from "./task-inventory-config";

const FormBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
}));

interface Props {
  taskSpec: MinecraftTaskSpec;
  setTaskSpec: React.Dispatch<React.SetStateAction<MinecraftTaskSpec>>;
  taskInstance: MinecraftTaskInstance;
  setTaskInstance: React.Dispatch<React.SetStateAction<MinecraftTaskInstance>>;
  blueprints: MinecraftBlueprint[];
}

const TaskConfigPanel: React.FC<Props> = ({
  taskSpec,
  setTaskSpec,
  taskInstance,
  setTaskInstance,
  blueprints  
}) => {
  
  return (
    <StyledCard
      sx={{ width: "100%" }}
    >
      <StyledCardHeader
        title="Task Configuration"
      />  
      <StyledCardContent>
        <FormBox>
          <TaskSpecConfig taskSpec={taskSpec} setTaskSpec={setTaskSpec} />
          
          
        </FormBox>
      </StyledCardContent>
      
    </StyledCard>
    
  );
};

export default TaskConfigPanel;