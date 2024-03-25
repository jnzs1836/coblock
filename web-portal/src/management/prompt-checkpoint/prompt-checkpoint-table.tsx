import React, { useMemo } from "react";
import { useTable, usePagination, Column } from "react-table";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, styled } from "@mui/material";
import { Edit, Visibility, Delete, ContentCopy, Add } from "@mui/icons-material";
import { PromptCheckpoint } from "../../types/prompt";
import ActionDialog from "../../page/action-dialogue";
import { useRequestConfirmDialogueWrapper } from "../../web/hooks";
import RequestConfirmDialogue from "../../page/request-confirm-dialogue";

const StyledTableCell = styled(TableCell)`
  font-weight: bold;
`;

interface Props {
    data: PromptCheckpoint[];
    columns: Column<PromptCheckpoint>[];
    onCreateNewPromptCheckpoint: () => Promise<any>;
    onEditPromptCheckpoint: (promptCheckpointId: string) => void;
    onDeletePromptCheckpoint: (promptCheckpointId: string) => Promise<Response>;
    externalUpdate: () => void;
}

const StyledButton = styled(Button)({
    marginLeft: "15px",
})

const PaginationRow = styled("div")({
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    justifyItems: "center",
    marginRight: "5px",

})

const PromptCheckpointTable: React.FC<Props> = ({ data, columns, onCreateNewPromptCheckpoint, onEditPromptCheckpoint, onDeletePromptCheckpoint, externalUpdate }) => {
    const tableData = useMemo(() => data, [data]);
    const tableColumns = useMemo(() => columns, [columns]);

    // @ts-ignore
    const { getTableProps, getTableBodyProps, headerGroups, prepareRow, page, pageCount, gotoPage, nextPage, previousPage, canNextPage, canPreviousPage } = useTable(
        {
            columns: tableColumns,
            data: tableData,
            // @ts-ignore
            initialState: { pageIndex: 0, pageSize: 10 }
        },
        usePagination
    );

    const {
        showConfirmDialogue: deletePromptCheckpointShowConfirmDialogue,
        wrappedRequestFunc: onDeletePromptCheckpointWrapped,
        status: onDeleteNewPromptCheckpointStatus,
        onDialogueClose: onDeletePromptCheckpointDialogueClose,
        openConfirmDialogue: onDeletePromptCheckpointOpenConfirmDialogue,
        confirm: onDeletePromptCheckpointConfirm,
    } = useRequestConfirmDialogueWrapper<Response>(onDeletePromptCheckpoint, true, externalUpdate)

    return (
        <TableContainer component={Paper}>
            <Table
                sx={{ width: 650 }}
            {...getTableProps()}>
                <TableHead>
                    {headerGroups.map((headerGroup) => (
                        <TableRow {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => {
                                if (column.id !== "messagePrefix" && column.id !== "messageSuffix") {
                                    return <StyledTableCell {...column.getHeaderProps()}>{column.render("Header")}</StyledTableCell>;
                                }
                                return null;
                            })}
                            <StyledTableCell>Actions</StyledTableCell>
                        </TableRow>
                    ))}
                </TableHead>
                <TableBody {...getTableBodyProps()}>
                    {
                        // @ts-ignore
                        page.map((row) => {
                            prepareRow(row);
                            return (
                                <TableRow {...row.getRowProps()}>
                                    {
                                        // @ts-ignore
                                        row.cells.map((cell) => {
                                            if (cell.column.id !== "messagePrefix" && cell.column.id !== "messageSuffix") {
                                                return <TableCell {...cell.getCellProps()}>{cell.render("Cell")}</TableCell>;
                                            }
                                            return null;
                                        })}
                                    <TableCell>
                                        <IconButton
                                        
                                        >
                                            <Edit 
                                            onClick={() => {  onEditPromptCheckpoint(row.original.id) }}
                                            />
                                        </IconButton>
                                        {/* <IconButton>
                                            <Visibility />
                                        </IconButton> */}
                                        <IconButton>
                                            <Delete
                                                onClick={() => {  
                                                    onDeletePromptCheckpointOpenConfirmDialogue(row.original.id) }}
                                            />
                                        </IconButton>
                                        {/* <IconButton>
                                            <ContentCopy />
                                        </IconButton> */}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                </TableBody>
            </Table>
            <PaginationRow>
                <div>

                    <IconButton onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                        {"<<"}
                    </IconButton>
                    <IconButton onClick={() => previousPage()} disabled={!canPreviousPage}>
                        {"<"}
                    </IconButton>
                    <IconButton onClick={() => nextPage()} disabled={!canNextPage}>
                        {">"}
                    </IconButton>
                    <IconButton onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                        {">>"}
                    </IconButton>
                    <span>
                        Page {page[0]?.index + 1} of {pageCount}
                    </span>

                </div>
                <StyledButton variant="contained" color="primary" startIcon={<Add />} onClick={() => {  onCreateNewPromptCheckpoint() }}>
                    New Prompt
                </StyledButton>
            </PaginationRow>
            < RequestConfirmDialogue
                title="Delete Prompt Checkpoint"
                content="Are you sure you want to delete this prompt checkpoint?"
                onClose={onDeletePromptCheckpointDialogueClose}
                open={deletePromptCheckpointShowConfirmDialogue}
                onConfirm={onDeletePromptCheckpointConfirm}
                status={onDeleteNewPromptCheckpointStatus}
            />
        </TableContainer>
    );
};

export default PromptCheckpointTable;
