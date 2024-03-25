import React from 'react';
import { Box, Typography } from '@mui/material';

interface SelectContainerProps {
  children: React.ReactNode;
  title: string;
}

const SelectContainer: React.FC<SelectContainerProps> = ({ children, title }) => {
  return (
    <Box mb={2}>
      <Typography variant="subtitle1" component="h3" mb={1}>
        {title}
      </Typography>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        border="1px solid rgba(0,0,0,0.2)"
        borderRadius="4px"
        minHeight="150px"
        bgcolor="rgba(0,0,0,0.05)"
        width="100%"
      >
        {children}
      </Box>
    </Box>
  );
};

export default SelectContainer;
