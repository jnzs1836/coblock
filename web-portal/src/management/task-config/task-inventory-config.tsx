import React from "react";
import {
  Box,
  FormControlLabel,
  FormGroup,
  Switch,
  TextField,
} from "@mui/material";
import { styled } from "@mui/system";
import { MinecraftWorldAgentAction, MinecraftWorldAgentInventoryBlockState

} from "../../types/minecraft";

interface InventoryConfigProps {
  inventory: MinecraftWorldAgentInventoryBlockState[];
  setInventory: (newInventory: MinecraftWorldAgentInventoryBlockState[]) => void;
}

const BlockColorBox = styled(Box)(({ theme }) => ({
  width: theme.spacing(4),
  height: theme.spacing(4),
  marginRight: theme.spacing(1),
}));

const TaskInventoryConfig: React.FC<InventoryConfigProps> = ({
  inventory,
  setInventory,
}) => {
  const colorMap: Record<string, string> = {
    red: "#f44336",
    blue: "#2196f3",
    yellow: "#ffeb3b",
    purple: "#9c27b0",
    green: "#4caf50",
    black: "#000000",
  };

  const handleInventoryChange = (
    blockType: string,
    value: number
  ) => {

    const matchedInventoryBlocks = inventory.filter((item, index) => item.blockType === blockType);
    if(matchedInventoryBlocks.length > 0){
      let machedInventoryBlock = matchedInventoryBlocks[0];
      let updatedInventory = [...inventory.map((item, index) => {
        if(item.blockType === blockType){
          return {
              ...item,
              count: value,
            }}
            else {
              return item;
            }}
          )];
          setInventory(updatedInventory);
    }else{
      if(value > 0){
        let updatedInventory = [...inventory];
        updatedInventory.push({
          blockType: blockType,
          count: value,
        });
        setInventory(updatedInventory);
      }
    }
    // let updatedInventory = [...inventory];
    // updatedInventory[index][field] = '';
    // setInventory(updatedInventory);
  };


  return (
    <FormGroup
      sx={{paddingTop: 3, }}
    >

      <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>

      {Object.keys(colorMap).map((color, index) => {
        const matchedInventoryBlocks = inventory.filter((item, index) => item.blockType === color);
        let matchedInventoryBlock = undefined;
        if(matchedInventoryBlocks.length > 0){
          matchedInventoryBlock = matchedInventoryBlocks[0]
        }

        return (
        <Box 
          gridColumn="span 4"
          key={color} display="flex" alignItems="center"
              sx={{
                  marginRight: 2,
                  marginBottom: 2,
              }}
        >
          <BlockColorBox bgcolor={colorMap[color]} />
          <TextField
            label={`${color} blocks`}
            type="number"
            value={matchedInventoryBlock?.count || 0}
            onChange={(e) =>
              handleInventoryChange(color, Number(e.target.value))
            }
            size="small" 
            sx={{
                width: 60,
                marginRight: 2,
            }}
          />
          
        </Box>
      )})}
      </Box>
    </FormGroup>
  );
};

export default TaskInventoryConfig;
