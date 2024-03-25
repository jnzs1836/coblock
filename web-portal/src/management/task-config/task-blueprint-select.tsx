import React from "react";
import { MinecraftTaskInstance } from "../../types/task";
import { MinecraftBlueprint } from "../../types/minecraft";
import { FC, useMemo, Fragment, ChangeEvent, useState } from 'react';
import { useTable, usePagination } from 'react-table';
import { Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Button, ButtonGroup, Box, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Checkbox } from '@mui/material';
import { convertBlueprintListToTable, convertBlueprintListToTaskSelectTable } from '../blueprint-management-hooks';
import { SelectChangeEvent } from '@mui/material/Select';
import ActionDialog from '../../page/action-dialogue';
import LoadingDialogue from '../../page/loading-dialogue';
import BlueprintPreviewModal from '../blueprint-preview-modal';
import styled from "@emotion/styled";

interface BlueprintSelectionProps {
  taskInstance: MinecraftTaskInstance;

  setTaskInstance: React.Dispatch<React.SetStateAction<MinecraftTaskInstance>>;
  blueprints: MinecraftBlueprint[];
  onSetAgentBlueprint: (blueprint: MinecraftBlueprint, agentIndex: number) => void;
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

const Container = styled("div")({
    width: "100%",
})

const BlueprintSelection: React.FC<BlueprintSelectionProps> = ({
  taskInstance,
  setTaskInstance,
  blueprints,
  onSetAgentBlueprint,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBlueprint, setSelectedBlueprint] = useState<MinecraftBlueprint>();
  const [isLoadingCollaborationDialogueOpen, setLoadingCollaborationDialogueOpen] = useState(false)

  const [isPreviewOpen, setPreviewOpen] = useState(false);

  const handleBlueprintSelection = (selectedBlueprint: MinecraftBlueprint) => {
    setTaskInstance((prevState) => ({
      ...prevState,
      blueprints: [...prevState.blueprints, selectedBlueprint],
    }));
  };

  const columns = useMemo(
    () => [
      { Header: 'Name', accessor: 'name' },
      { Header: 'Block Count', accessor: 'blockCount' },
      // @ts-ignore
      {
        // @ts-ignore
        Header: 'Colors', accessor: 'colors', Cell: ({ value }) => {
          return (
            <Box display="flex">
              {COLORS.map((color) => (
                <Fragment>

                  <Box
                    key={color}
                    bgcolor={"transparent"}
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
          )
        }
      },

      {
        Header: 'Actions',
        accessor: 'blueprint',
        // @ts-ignore
        Cell: (cellData) => {
          return (
            <>
              <Button variant="contained"
                size="small"
                color="success" sx={{ mx: 1 }}
                onClick={() => {
                  // @ts-ignore
                  setSelectedBlueprint(cellData.blueprint);
                  // setPreviewOpen(true);
                }}
              >
                Preview
              </Button>
              {/* <Button variant="contained" 
            size="small"
            onClick={() => {
              handleEdit(value);
            }}
            color="primary" sx={{ mx: 1 }}>
            Edit
          </Button> */}

            </>
          )
        },
      },
      {
        Header: 'Task',
        accessor: 'taskUsage',
        // @ts-ignore
        Cell: ({ value }) => {
          return (
            <>
            
              <Checkbox 
                  checked={value.baseBlueprint}
                  onChange={() => {
                    onSetAgentBlueprint(value.blueprint, 0)
                    // onSetAgentBlueprint(value.blueprint, 1)
                  }}
               defaultChecked />
              {/* <Button variant="contained" 
            size="small"
            onClick={() => {
              handleEdit(value);
            }}
            color="primary" sx={{ mx: 1 }}>
            Edit
          </Button> */}

            </>
          )
        },
      },
    ],
    []
  );

  const data = useMemo(() => convertBlueprintListToTaskSelectTable(blueprints, taskInstance), [blueprints, taskInstance]);

  // @ts-ignore
  const tableInstance = useTable({ columns, data }, usePagination);

  // @ts-ignore
  const { getTableProps, getTableBodyProps, headerGroups, page, prepareRow, pageCount, gotoPage, nextPage, previousPage, canNextPage, canPreviousPage, setPageSize, state: { pageIndex, pageSize } } = tableInstance;

  return (
    <Container>
      {/* Add a section to select blueprints /}
{/ You can create a UI to list and select the available blueprints /}
{/ Call handleBlueprintSelection(selectedBlueprint) when a blueprint is selected */}
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


        <BlueprintPreviewModal
          open={isPreviewOpen}
          onClose={() => setPreviewOpen(false)}
          blueprint={selectedBlueprint}
        />


      </>

    </Container>
  );
};

export default BlueprintSelection;

