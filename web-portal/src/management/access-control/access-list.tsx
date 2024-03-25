import React, { useState } from 'react';
import { Box, Button, CircularProgress, IconButton, MenuItem, Select, TableCell, TableRow, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { BlueprintAccess, MinecraftBlueprint } from '../../types/minecraft';
import styled from '@emotion/styled';
import { useActionRequest } from '../../web/hooks';
import { RequestState } from '../../web/types';
import AccessListItem from './access-list-item';

interface AccessListProps {
    accessList: BlueprintAccess[],
  onDelete: (id: string) => void,
  onUpdate: (id: string ) => void,
  blueprint: MinecraftBlueprint,
}

const Container = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    width : '560px',
})

const AccessList: React.FC<AccessListProps> = ({ blueprint, accessList, onDelete, onUpdate,}) => {
//   const [updating, setUpdating] = useState<string | null>(null);


    


  return (
    <Container>
      {accessList.map((access: BlueprintAccess) => (
        <TableRow
            sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                width : '560px'}}
        key={access.id}>
            <AccessListItem 
                blueprint={blueprint}
                key={access.id}
                access={access}
                onDelete={onDelete}
            />
                  </TableRow>
      ))}
    </Container>
  );
};

export default AccessList;
