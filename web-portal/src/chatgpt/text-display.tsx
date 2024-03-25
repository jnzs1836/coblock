import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CardHeader } from '@mui/material';
import {styled} from '@mui/material';


interface TextDisplayProps {
    text: string;
    sx?: Record<string, any>;
    title ?: string;
}

const TextContainer = styled("div")({
    overflowY:"scroll", height: "280px"
})

const TextDisplay: React.FC<TextDisplayProps> = ({ text, sx , title}) => {
    
    return (
        <Card 
            sx={{width:"200px", ...sx}}
        style={{ backgroundColor: '#f5f5f5',  }} variant="outlined">
        {/* <CardContent> */}
        {title !== undefined && <Typography variant="body1" component="div" 
            textAlign={'left'}
        >
            {title}
      </Typography>}
        <TextContainer>
            <Typography style={{ fontStyle: 'italic', textAlign: 'left' }}   variant="body2">
                {text.split('\n').map((line, index) => (
                <React.Fragment key={index}>
                    {line}
                    <br />
                </React.Fragment>
                ))}
            </Typography>
        </TextContainer>
          
        {/* </CardContent> */}
      </Card>
    );
};

export default TextDisplay;