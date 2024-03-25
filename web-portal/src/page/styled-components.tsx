import React from 'react';
import {Card, CardContent, CardHeader, CardHeaderProps, styled} from '@mui/material';

export const StyledCard = styled(Card)({
  // width: "360px",
  flexGrow: 1,
  '&:last-child': {
    // styles for the last CardContent element
    // marginBottom: '99px',
  },
  marginBottom: '10px',
  // height: '100%',
});


export const StyledCardHeader = (props: CardHeaderProps) => {
  return (
    <CardHeader {...props}
      titleTypographyProps={{variant: "h6" }}
      sx={{paddingBottom: 0}}
    />
  )
}

export const StyledCardContent = styled(CardContent)({  
    marginTop: 0,
    paddingTop: 0,
    paddingBottom: "5px !important",
    root: {
      paddingBottom: 0,
    },

})

export const Column = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  justifyContent: 'flex-start',
  height: '100vh',
  color: 'white',
  marginLeft: '1rem',
});

export const FlexStartColumn = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  justifyContent: 'flex-start',
  marginLeft: '1rem',
});
