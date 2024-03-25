import { FC, useMemo, Fragment, ChangeEvent, useState } from 'react';
import { useTable, usePagination } from 'react-table';
import { Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Button, ButtonGroup, Box, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { MinecraftBlueprint } from '../types/minecraft';
import { convertBlueprintListToTable } from './blueprint-management-hooks';
import { SelectChangeEvent } from '@mui/material/Select';
import ActionDialog from '../page/action-dialogue';
import LoadingDialogue from '../page/loading-dialogue';
import BlueprintPreviewModal from './blueprint-preview-modal';
import AccessControlDialogue from './access-control/access-control-dialogue';

interface BlueprintTableProps {
  blueprints: MinecraftBlueprint[];
  onBlueprintDelete: (blueprint: MinecraftBlueprint) => void;
  onBlueprintEdit: (blueprint: MinecraftBlueprint) => void;
  onBlueprintCollaborationStart: (blueprint: MinecraftBlueprint) => void;
}
const colorMap: Record<string, string> = {
  red: '#f44336',
  blue: '#2196f3',
  yellow: '#ffeb3b',
  purple: '#9c27b0',
  green: '#4caf50',
  black: '#000000',
};
const COLORS = ["red", "yellow", "green", "blue", "purple", "black"];
const BlueprintTable: FC<BlueprintTableProps> = ({ blueprints, onBlueprintDelete, onBlueprintEdit, onBlueprintCollaborationStart }) => {

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBlueprint, setSelectedBlueprint] = useState<MinecraftBlueprint>();
  const [isLoadingCollaborationDialogueOpen, setLoadingCollaborationDialogueOpen] = useState(false)

  const [isPreviewOpen, setPreviewOpen] = useState(false);
  const [isShareOpen, setShareOpen] = useState(false);

  const handleDelete = (blueprint: MinecraftBlueprint) => {
    setIsDialogOpen(true);
    setSelectedBlueprint(blueprint);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleConfirmDelete = () => {
    // handle the delete action here
    if(selectedBlueprint === undefined) {
      return;
    }else{
      onBlueprintDelete(selectedBlueprint);
    }

    handleCloseDialog();

  };

  const handleEdit = (blueprint: MinecraftBlueprint) => {
    onBlueprintEdit(blueprint);
  };

  const handleCollaboration = (blueprint: MinecraftBlueprint) => {
    setLoadingCollaborationDialogueOpen(true);
    onBlueprintCollaborationStart(blueprint);
  }

  const handleShare = (blueprint: MinecraftBlueprint) => {
    setSelectedBlueprint(blueprint);
    setShareOpen(true);
  }


  const columns = useMemo(
    () => [
      { Header: 'Name', accessor: 'name' },
      { Header: 'Block Count', accessor: 'blockCount' },
      // @ts-ignore
      { Header: 'Colors', accessor: 'colors', Cell: ({value}) => {
        return (
        <Box display="flex">
          {COLORS.map((color) => (
            <Fragment>
              
              <Box
                key={color}
                bgcolor={ "transparent"}
                width={8}
                height={8}
                margin={0.5}
                sx={{
                  position: 'relative',

                }}
              >
                  <Box
                    key={color}
                    bgcolor={value.includes(color) ? color : "transparent"}
                    width={8}
                    height={8}
                    sx={{
                      background: value.includes(color) ? color : `linear-gradient(rgba(200, 200, 200, 0.9), rgba(200, 200, 200, 0.9)), ${color}`,
                      alpha: 0.5,
                      position: 'relative',

                    }}
                  />
              </Box>
              
            </Fragment>
          ))}
        </Box>
      )}},

      {
        Header: 'Actions',
        accessor: 'blueprint',
        // @ts-ignore
        Cell: ({value}) => {
          return (
          <>
            <Button variant="contained" 
                size="small"
                color="success" sx={{ mx: 1 }}
                onClick={() => {
                  setSelectedBlueprint(value);
                  setPreviewOpen(true);
                }}
                >
              Preview
            </Button>
            <Button variant="contained" 
              size="small"
              onClick={() => {
                handleEdit(value);
              }}
              color="primary" sx={{ mx: 1 }}>
              Edit
            </Button>
            <Button variant="contained" 
              size="small"
              onClick={() => {
                handleCollaboration(value);
              }}
              color="warning" sx={{ mx: 1 }}>
              Start
            </Button>
            <Button variant="contained" 
              size="small"
              color="secondary" sx={{ mx: 1 }}
              onClick={() => {
                handleShare(value);
                // handleDelete(value);
              }}
              >
                Share
            </Button>
            <Button variant="contained" 
              size="small"
              color="error" sx={{ mx: 1 }}
              onClick={() => {
                handleDelete(value);
              }}
              >
              Delete
            </Button>
          </>
        )},
      },
    ],
    []
  );

  const data = useMemo(() => convertBlueprintListToTable(blueprints), [blueprints]);

  // @ts-ignore
  const tableInstance = useTable({ columns, data }, usePagination);

  // @ts-ignore
  const { getTableProps, getTableBodyProps, headerGroups, page, prepareRow, pageCount, gotoPage, nextPage, previousPage, canNextPage, canPreviousPage, setPageSize, state: { pageIndex, pageSize } } = tableInstance;

  return (
    <>
      <TableContainer>
        <Table {...getTableProps()}>
          <TableHead>
            {
              // @ts-ignore
            headerGroups.map(headerGroup => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {
                  // @ts-ignore
                headerGroup.headers.map(column => (
                  <TableCell {...column.getHeaderProps()}>{column.render('Header')}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody {...getTableBodyProps()}>
            {
              // @ts-ignore
            page.map((row, i) => {
              prepareRow(row);
              return (
                <TableRow {...row.getRowProps()}>
                  {
                  // @ts-ignore
                  row.cells.map(cell => (
                    <TableCell {...cell.getCellProps()}>{cell.render('Cell')}</TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={data.length}
        rowsPerPage={pageSize}
        page={pageIndex}
        onPageChange={gotoPage}
        onRowsPerPageChange={(event: ChangeEvent<HTMLInputElement>) => {
          setPageSize(Number(event.target.value));
        }}
        ActionsComponent={() => (
          <ButtonGroup>
            <Button variant="outlined" size="small" onClick={() => previousPage()} disabled={!canPreviousPage}>
              Previous
            </Button>
            <Button variant="outlined" size="small" onClick={() => nextPage()} disabled={!canNextPage}>
              Next
            </Button>
            
          </ButtonGroup>
        )}
      />
            {/* <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the blueprint: <b></b>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog> */}
      <ActionDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmDelete}
        title="Delete Confirmation"
        content={`Are you sure you want to delete the blueprint ${selectedBlueprint?.name}?`}
      />

      <LoadingDialogue open={isLoadingCollaborationDialogueOpen} 
        title="Loading"
        content="Loading your session"
      />

      <BlueprintPreviewModal
        open={isPreviewOpen}
        onClose={() => setPreviewOpen(false)}
        blueprint={selectedBlueprint}
      />
      <AccessControlDialogue
        open={isShareOpen}
        blueprint={selectedBlueprint}
        onClose={() => setShareOpen(false)}
        onConfirm={()=>{}}
      />

    </>
  );
};

export default BlueprintTable;
