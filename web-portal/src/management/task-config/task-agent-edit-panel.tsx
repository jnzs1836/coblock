import { StyledCard, StyledCardContent, StyledCardHeader } from "../../page/styled-components";
import { styled } from "@mui/system"
import TaskInventoryConfig from "./task-inventory-config";
import { useState } from "react";
import { MinecraftBlueprint, MinecraftWorldAgentInventoryBlockState } from "../../types/minecraft";
import { StructureMotiveConfig, StructureMotiveInstance } from "../../types/task";
import { Card } from "@mui/material";
import TaskAgentRoleSelect from "./task-agent-role-select";
import UserMotives from "../user-motive/user-motives";
import { useUserMotives } from "../user-motive/hooks";



interface Props {
    agentName: string,
    inventory: MinecraftWorldAgentInventoryBlockState[],
    // setInventory: React.Dispatch<React.SetStateAction<MinecraftWorldAgentInventoryBlockState[]>>;
    setInventory: (newInventory: MinecraftWorldAgentInventoryBlockState[]) => void;

    setAgentName: (value: string) => void;
    setAgentType: (value: string) => void;
    blueprint: MinecraftBlueprint | undefined;
    motives: StructureMotiveInstance[]; 
    setMotives: (fn: (prev: StructureMotiveInstance[]) => StructureMotiveInstance[]) => void;
    agentType: string,
}

const InventoryEditRow = styled(Card)({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginBottom: 8,
    flexBasis: 3,
    flexGrow: 3,
})

interface InventoryBlockTypeEditProps {
    blockType: string,
}

const Column = styled("div")({
    display: "flex",
    flexDirection: "column",
    marginRight: 10,
    flexBasis: 2,
    flexGrow: 2,
    height: "300px"
});



export default function TaskAgentEditPanel({ agentName, inventory, setInventory, setAgentName, setAgentType, blueprint, motives, setMotives, agentType }: Props) {

    const userMotivesProps = useUserMotives(motives, setMotives);

    return (
        <StyledCard
            sx={{ width: "100%" }}
        >
            <StyledCardHeader title={agentName} />
            <StyledCardContent
                sx={{
                    marginTop: 2,
                    display: "flex",
                    flexDirection: "row",
                }}
            >
                <Column>
                    <TaskAgentRoleSelect
                        setAgentType={setAgentType}
                        setAgentName={setAgentName}
                        defaultName={agentName}
                        sx={{
                            marginBottom: 2,
                            paddingLeft: 1
                        }}
                        defaultAgentType={agentType}
                    />
                    <InventoryEditRow>
                        <TaskInventoryConfig
                            inventory={inventory}
                            setInventory={setInventory}
                        />
                    </InventoryEditRow>

                </Column>
                <UserMotives
                    blueprint={blueprint}
                    {...userMotivesProps}
                    sx={{
                        flexBasis: 1,
                        flexGrow: 1,
                        height: 300
                    }}
                    
                />

            </StyledCardContent>
        </StyledCard>
    )
}