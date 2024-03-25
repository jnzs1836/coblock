import { FC, useMemo, Fragment, ChangeEvent, useState } from 'react';
import { useTable, usePagination } from 'react-table';
import { Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Button, ButtonGroup, Box, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { MinecraftBlueprint } from '../types/minecraft';
import { MinecraftCollaborationSession } from '../types/task';
import { convertBlueprintListToTable } from './blueprint-management-hooks';
import { SelectChangeEvent } from '@mui/material/Select';
import ActionDialog from '../page/action-dialogue';
import LoadingDialogue from '../page/loading-dialogue';
import BlueprintPreviewModal from './blueprint-preview-modal';
import { convertCollaborationSessionListToTable } from './session-hooks';

interface TableActionDef {
  name: string;
  disabledText: string;
  onClick: (session: MinecraftCollaborationSession) => void;
  enabled: (session: MinecraftCollaborationSession) => boolean;
}

interface CollaborationSessionTableProps {
  sessions: MinecraftCollaborationSession[];
  onSessionResume: (session: MinecraftCollaborationSession) => void;
  onSessionDelete: (session: MinecraftCollaborationSession) => void;
  additionalActions?: TableActionDef[]
  contextualStatus?: number
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
const CollaborationSessionTable: FC<CollaborationSessionTableProps> = ({
  sessions, onSessionResume, onSessionDelete, additionalActions, contextualStatus
}) => {

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBlueprint, setSelectedBlueprint] = useState<MinecraftBlueprint>();
  const [isLoadingCollaborationDialogueOpen, setLoadingCollaborationDialogueOpen] = useState(false)

  const [isPreviewOpen, setPreviewOpen] = useState(false);
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const renderAdditionalActions = (session: MinecraftCollaborationSession) => {
    return (
      <Fragment>
        {
          additionalActions?.map((actionDef) => {
            return (
              <Button variant="contained"
                disabled={!actionDef.enabled(session)}
                size="small"
                onClick={() => {
                  actionDef.onClick(session);
                }}
                color="primary" sx={{ mx: 1 }}>
                {actionDef.enabled(session) ? actionDef.name : actionDef.disabledText}
              </Button>
            )
          })}
      </Fragment>
    )
  }

  const columns = useMemo(
    () => [
      { Header: 'ID', accessor: 'id' },
      {
        Header: "Valid", accessor: 'isValid'
      },
      // @ts-ignore
      {
        Header: 'Actions',
        accessor: 'data',
        // @ts-ignore
        Cell: ({value, blueprint, ...cellData}) => {
          return (
            <>
              <Button variant="contained"
                size="small"
                color="success" sx={{ mx: 1 }}
                onClick={() => {
                  setSelectedBlueprint(value.blueprint as MinecraftBlueprint);
                  setPreviewOpen(true);
                }}
              >
                Preview
              </Button>
              <Button variant="contained"
                size="small"
                onClick={() => {
                  onSessionResume(value);
                }}
                color="primary" sx={{ mx: 1 }}>
                Resume
              </Button>
              <Button variant="contained"
                size="small"
                color="error" sx={{ mx: 1 }}
                onClick={() => {
                  onSessionDelete(value);
                }}
              >
                Delete
              </Button>
              {
                renderAdditionalActions(value)
              }
            </>
          )
        },
      },
    ],
    [contextualStatus]
  );

  const data = useMemo(() => convertCollaborationSessionListToTable(sessions), [sessions]);

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
      <LoadingDialogue open={isLoadingCollaborationDialogueOpen}
        title="Loading"
        content="Loading your session"
      />

      <BlueprintPreviewModal
        open={isPreviewOpen}
        onClose={() => setPreviewOpen(false)}
        blueprint={selectedBlueprint}
      />


    </>
  );
};

export default CollaborationSessionTable;
