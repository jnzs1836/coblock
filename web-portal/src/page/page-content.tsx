import React from 'react';
import {styled} from '@mui/material';

const StyledPageContent = styled("div")(({ theme }) => ({
  backgroundColor: "#fafafa",
  padding: theme.spacing(4),
  display: "flex",
  flexDirection: "row",
  alignItems: "flex-start",
  justifyContent: "center",
}))

interface PageContentProps {
    children: React.ReactNode;
    sx?: Record<string, unknown>;
}

const PageContent: React.FC<PageContentProps> = ({ children, sx }) => {
  return (
    <StyledPageContent
      sx={sx}
    >
      {children}
    </StyledPageContent>
  );
};


export default PageContent;
