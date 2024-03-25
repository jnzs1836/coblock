import React, { useState } from "react";
import { Box, Button, CircularProgress, IconButton, MenuItem, Select, TableCell, TableRow, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { BlueprintAccess, MinecraftBlueprint } from '../../types/minecraft';
import styled from '@emotion/styled';
import { useActionRequest } from '../../web/hooks';
import { RequestState } from '../../web/types';
import { convertResponseToBlueprintAccess } from "./hooks";


interface AccessListItemProps {
    access: BlueprintAccess,
    blueprint: MinecraftBlueprint,
    onDelete: (id: string) => void,
}


export default function AccessListItem({ access, blueprint, onDelete }: AccessListItemProps) {

    const { doRequest, status } = useActionRequest(
        {
            method: "PUT"
        }
    );
    const { doRequest: doDelete, status: statusDelete } = useActionRequest(
        {
            method: "DELETE"
        }
    );

    const [updatedAccess, setUpdatedAccess] = useState<BlueprintAccess>(access);

    const updating = status === RequestState.LOADING;


    const handleAccessChange = (access: BlueprintAccess) => {
        // setUpdating(access.id);
        // onUpdate(access.id, access);
        const formData = new FormData();
        formData.append('can_view', access.canView.toString());
        formData.append('can_edit', access.canEdit.toString());
        formData.append('can_manage', access.canManage.toString());
        formData.append('collaborator', access.collaborator);

        doRequest(
            new URL(`/api/blueprints/${blueprint.id}/collaborators/${access.id}/`, window.location.href),
            formData,
        ).then((data) => {
            setUpdatedAccess(convertResponseToBlueprintAccess(data));
            // onDelete(access.id)
        })
    };

    const handleAccessDelete = (id: string) => {
        const formData = new FormData();

        doDelete(
            new URL(`/api/blueprints/${blueprint.id}/collaborators/${access.id}/`, window.location.href),
            formData,
            false
        ).then((data) => {
            onDelete(access.id);
        })
        // setUpdating(id);
        // onDelete(id);
    }


    return (
        <React.Fragment>
            <TableCell
                sx={{
                    flexGrow: 2
                }}
                component="th" scope="row">
                <Typography variant="body1">{updatedAccess.collaboratorName}</Typography>
            </TableCell>
            <TableCell>
                <Select
                    sx={{
                        minWidth: '180px',
                    }}
                    value={updatedAccess.canManage ? 'manage' : updatedAccess.canEdit ? 'edit' : 'view'}
                    disabled={updating}
                    onChange={e => {
                        let newAccess = {
                            ...updatedAccess,
                            canView: e.target.value === 'view',
                            canEdit: e.target.value === 'edit' || e.target.value === 'manage',
                            canManage: e.target.value === 'manage',
                        }
                        setUpdatedAccess(newAccess);
                        return handleAccessChange(newAccess)}}
                >
                    <MenuItem value="view">View</MenuItem>
                    <MenuItem value="edit">Edit</MenuItem>
                    <MenuItem value="manage">Manage</MenuItem>
                </Select>
                {updating && <CircularProgress size={24} />}
            </TableCell>
            <TableCell align="right">
                <IconButton onClick={() => 
                    handleAccessDelete(access.id)}>
                    <DeleteIcon />
                </IconButton>
            </TableCell>

        </React.Fragment>
    )
}