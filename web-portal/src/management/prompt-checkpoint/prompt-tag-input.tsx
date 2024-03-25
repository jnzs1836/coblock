import React, { useState } from "react";
import { Alert, Chip, TextField } from "@mui/material";
import {styled} from "@mui/material/styles";


interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

const Container = styled("div")({
    display: "flex",
    flexDirection: "column",
})

const TagInput = ({ tags, onChange }: TagInputProps) => {
  const [inputTag, setInputTag] = useState("");

  const handleInputTagChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInputTag(event.target.value);
  };

  const tagDuplicated = tags.includes(inputTag.trim());

  const handleInputTagKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (inputTag.trim() !== "") {
        if(tags.includes(inputTag.trim())) {
            return;
        }
        onChange([...tags, inputTag.trim()]);
        setInputTag("");
      }
    }
  };

  const handleRemoveTag = (tag: string) => {
    onChange(tags.filter((t) => t !== tag));
  };

  return (
    <Container>

    
    <TextField
    sx={{
        width: "100%",
    }}
      label="Tag"
      variant="outlined"
      value={inputTag}
      onChange={handleInputTagChange}
      onKeyDown={handleInputTagKeyDown}
      style={{ flexGrow: 2 }}

      InputProps={{
        style: { display: "flex", flexWrap: "wrap", paddingTop: "14px" },
        startAdornment: tags.map((tag) => (
          <Chip 
            sx={{ marginRight: "4px", marginBottom: "4px" }}
          key={tag} label={tag} onDelete={() => handleRemoveTag(tag)} />
        )),
      }}
    />
    {tagDuplicated && <Alert severity="warning" sx={{ marginTop: "8px" }}> Tag already exists </Alert>}
</Container>
  );
};

export default TagInput;
