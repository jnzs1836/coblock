import { Card, TextField, Select, MenuItem, FormControlLabel, Switch } from "@mui/material";
import { useState } from "react";
import { SelectChangeEvent } from '@mui/material/Select';


interface Props {
    setAgentName: (value: string) => void,
    setAgentType: (value: string) => void,
    defaultName: string,
    sx?: Record<string, unknown>,
    defaultAgentType: string
}

export default function TaskAgentRoleSelect({ setAgentName, setAgentType, sx, defaultName, defaultAgentType }: Props) {
    const [value, setValue] = useState<string>("");

    const [isMachine, setIsMachine] = useState<boolean>(defaultAgentType === "machine");
    return (
        <Card
            sx={{
                paddingTop: 3,
                // marginRight: 2,
                flexBasis: 1,
                flexGrow: 1,
                ...sx
            }}
        >
            <TextField
                name="x"
                label="X"
                value={defaultName}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setValue(event.target.value);
                    setAgentName(event.target.value);
                }}
                size="small"
                sx={{
                    width: "100px",
                    marginRight: 3
                }}
            // sx={{ mb: 1 }}
            />
            <FormControlLabel 
            
            control={<Switch
                checked={isMachine}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setIsMachine(event.target.checked);
                    setAgentType("machine");
                    setAgentType(event.target.checked ? "machine" : "human");
                }}
            />} label={ "Auto"}  />
        </Card>
    )
}