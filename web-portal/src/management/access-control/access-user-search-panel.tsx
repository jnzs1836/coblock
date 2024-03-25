import { useRef, useState, Fragment } from 'react';
import {
    TextField, List, ListItem, ListItemText, Paper, Box, Select,
    Button,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Typography, Popover
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { BlueprintAccess, MinecraftBlueprint } from '../../types/minecraft';
import { User } from '../../types/user';
import { useGetAPI } from '../../web/hooks';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress'
import { useActionRequest } from '../../web/hooks';
import { convertResponseToBlueprintAccess } from './hooks';


const SearchPanel = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    marginTop: '16px',
});

const BackgroundPanel = styled(Paper)(({ theme }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: theme.zIndex.modal,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));


interface SearchListItemProps {
    name: string;
    onClick: () => void;
    onAddNewAccess: (access: BlueprintAccess) => void;
}

const SearchListItem = ({ name, onClick }: SearchListItemProps) => (
    <ListItem button onClick={onClick}>
        <ListItemText primary={name} />
    </ListItem>
);

interface AccessControlPanelProps {
    blueprint: MinecraftBlueprint;
    onUpdateAccessListRaw: (accessList: any) => void;
    onAddNewAccess: (access: BlueprintAccess) => void;
}

const SearchResultList = styled(Box)(({ theme }) => ({
    maxHeight: '200px',
    overflow: 'auto',
    backgroundColor: theme.palette.background.paper,
    marginTop: theme.spacing(1),
    borderRadius: '4px',
    boxShadow: theme.shadows[2]
}));

const SearchResultListItem = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(1),
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: theme.palette.action.hover
    }
}));



const AccessUserSearchPanel = ({ blueprint, onUpdateAccessListRaw, onAddNewAccess }: AccessControlPanelProps) => {
    const [searchText, setSearchText] = useState('');
    const [accessType, setAccessType] = useState<string>('view');
    const [selectedUser, setSelectedUser] = useState<User>();
    const anchorEl = useRef<HTMLDivElement | null>(null);
    const [searchOpen, setSearchOpen] = useState<boolean>(false);
    const [searchLoading, setSearchLoading] = useState<boolean>(false);


    const { doRequest, status: requestStatus } = useActionRequest(
        {
            method: "POST"
        }
    );

    //   const [searchResult, setSearchResult] = useState<string[]>([]);

    const { result: searchResultOrUndefined } = useGetAPI<User[]>(`/api/users/search?username=${searchText}`, searchText !== "", (res) => {
        if (res) {
            return res.map((user: any) => user as User);
        } else {
            return [];
        }
    });
    let searchResult = searchResultOrUndefined ? searchResultOrUndefined : [];

    const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value);
        // TODO: Perform search and update searchResult state
    };

    const handleAddAccess = (name: string) => {
        // TODO: Add access to accessList and update onAccessListChange
    };

    const handleUserSelect = (user: User) => {
        setSelectedUser(user);
        setSearchText(user.username);
        // setSearchResults([]);
    };

    const handleAddButtonClick = () => {
        if (selectedUser && accessType) {
            //   onUserSelect(selectedUser, accessType);
            setSelectedUser(undefined);
            setAccessType('view');
        }
    };



    return (
        <Box display="flex"
            alignContent={"center"}
            justifyContent={"space-between"}
        >
            <Box alignItems="center">
                <Autocomplete
                    id="asynchronous-demo"
                    sx={{ width: 300 }}
                    open={searchOpen}
                    onOpen={() => {
                        setSearchOpen(true);
                    }}
                    onClose={() => {
                        setSearchOpen(false);
                    }}
                    isOptionEqualToValue={(option, value) => option.username === value.username}
                    getOptionLabel={(option) => option.username}
                    options={searchResult}
                    loading={searchLoading}
                    onChange={(event, value) => {
                    }   
                    }
                    onInputChange={(event, value) => {
                        setSearchText(value);
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Asynchronous"
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <Fragment>
                                        {searchLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                        {params.InputProps.endAdornment}
                                    </Fragment>
                                ),
                            }}
                        />
                    )}
                />

                {selectedUser === undefined && <SearchResultList>
                    {searchResult && searchResult.map((user) => (
                        <SearchResultListItem key={user.id} onClick={() => handleUserSelect(user)}>
                            <Typography variant="body1">{user.username}</Typography>
                        </SearchResultListItem>
                    ))}
                </SearchResultList>}
            </Box>

            <Box display="flex" alignItems="center" >
                <Box marginLeft={1}>
                    <FormControl variant="outlined" size="small">
                        <InputLabel id="access-type-select-label">Access Type</InputLabel>
                        <Select
                            sx={{
                                minWidth: 100
                            }}
                            labelId="access-type-select-label"
                            id="access-type-select"
                            value={accessType}
                            onChange={(event) => {
                                setAccessType(event.target.value as string);
                            }}
                            label="Access Type"
                        >
                            <MenuItem value="view">View</MenuItem>
                            <MenuItem value="edit">Edit</MenuItem>
                            <MenuItem value="manage">Manage</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                
            </Box>
            <Box mt={1} mb={1} ml={2} display="flex" justifyContent="flex-end">
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={!selectedUser || !accessType}
                        onClick={() => {
                            const formData = new FormData();
                            formData.append('collaborator', selectedUser? selectedUser.id : "");

                            doRequest(`/api/blueprints/${blueprint.id}/collaborators/`, formData
                            ).then((res) => {
                                setSelectedUser(undefined);
                                setAccessType('view');
                                setSearchText('');
                                onAddNewAccess(convertResponseToBlueprintAccess(
                                    res
                                ))
                            });

                         }}
                    >
                        Add Access
                    </Button>
            </Box>
        </Box>
    );



};

export default AccessUserSearchPanel;
