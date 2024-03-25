import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { MinecraftTaskAgentView } from '../types/task';


interface Props {
    currentView: MinecraftTaskAgentView | undefined;
    onChange: (view: MinecraftTaskAgentView) => void;
    sx?: Record<string, unknown>;
    availableViews?: Array<MinecraftTaskAgentView>;
}


export default function MinecraftViewSelector({currentView, onChange, sx, availableViews}: Props) {
  
    const handleChange = (event: SelectChangeEvent) => {
        onChange(event.target.value as MinecraftTaskAgentView);
    };

    const availableViewPairs: Array<[MinecraftTaskAgentView, string]> = [
        [MinecraftTaskAgentView.View2DBehind, "Back"],
        [MinecraftTaskAgentView.View2DFront, "Front"],
        [MinecraftTaskAgentView.View2DLeft, "Left"],
        [MinecraftTaskAgentView.View2DRight, "Right"],
        [MinecraftTaskAgentView.View2DTop, "Top"],
        [MinecraftTaskAgentView.View3D, "3D"],
    ];

    const validAvailableViewPairs = availableViewPairs.filter(([view, label]) => availableViews?.includes(view) ?? true);

    const getViewLabel = (view: MinecraftTaskAgentView | undefined ) => {
        return validAvailableViewPairs.find(([v, label]) => v === view)?.[1] ?? "Unknown";
    }

    
    return (
        <FormControl sx={{ m: 1, minWidth: 120, ...sx, width: "90%"}}>
          <InputLabel id="demo-simple-select-helper-label">View</InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            value={currentView}
            label={getViewLabel(currentView)}
            onChange={handleChange}
          >
            {
                validAvailableViewPairs.map(([view, label]) => {
                    return <MenuItem value={view}>{label}</MenuItem>
                })
            }
            
          </Select>
          {/* <FormHelperText>Select the view of the target structure</FormHelperText> */}
        </FormControl>
    )
}