import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ConfirmDialog from '@/components/confirm-dialog/ConfirmDialog';
import { DEFAULT_TABLE_PAGE_SIZE } from '@/config/constants';
import CancelIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import Box from '@mui/material/Box';
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridEventListener,
  GridRowEditStopReasons,
  GridRowId,
  GridRowModel,
  GridRowModes,
  GridRowModesModel,
  GridRowsProp,
} from '@mui/x-data-grid';

import EditToolbar from '../EditToolbar';
import { DataTablePropsType } from './DataTable.type';

declare module '@mui/x-data-grid' {
  interface ToolbarPropsOverrides {
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setRowModesModel: (newModel: (oldModel: GridRowModesModel) => GridRowModesModel) => void;
  }
}

const DataTable = ({ data, dataColumns, count, setPaginationModel, setSortModel, handleData }: DataTablePropsType) => {
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [itemToDelete, setItemToDelete] = useState<GridRowId | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    setRows(data);
  }, [data]);

  /**
   * @function processRowUpdate
   *
   * @description Handles the update or addition of a row in the database. If the row is new, it adds the row;
   * otherwise, it updates the existing row. Updates the local state with the modified row.
   *
   * @param {GridRowModel} newRow - The row data to be updated or added.
   * @returns {Promise<GridRowModel>} The updated row data.
   */
  const processRowUpdate = async (newRow: GridRowModel): Promise<GridRowModel | undefined> => {
    if (newRow?.id && newRow.isNew) {
      const result = await handleData('add', newRow.id, newRow);
      if (result) {
        const updatedRow = { ...newRow, isNew: false, id: result };
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
      }
    } else {
      const result = await handleData('save', newRow.id, newRow);
      if (result) {
        const updatedRow = { ...newRow, isNew: false };
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
      }
    }
  };

  /**
   * @function handleDeleteClick
   *
   * @description Sets the ID of the row to be deleted. This ID is used to confirm the deletion in the dialog.
   *
   * @param {GridRowId} id - The ID of the row to delete.
   * @returns {void}
   */
  const handleDeleteClick = async (id: GridRowId): Promise<void> => {
    setItemToDelete(id);
  };

  /**
   * @function handleRowEditStop
   *
   * @description Prevents the default behavior of stopping row editing when the user clicks outside the row.
   *
   * @param {GridEventListener<'rowEditStop'>} params - The event parameters.
   * @param {React.SyntheticEvent} event - The event triggered by the action.
   * @returns {void}
   */
  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event): void => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  /**
   * @function handleEditClick
   *
   * @description Enables edit mode for a specific row.
   *
   * @param {GridRowId} id - The ID of the row to edit.
   * @returns {() => void} A function to enable edit mode for the row.
   */
  const handleEditClick =
    (id: GridRowId): (() => void) =>
    () => {
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

  /**
   * @function handleSaveClick
   *
   * @description Switches a specific row from edit mode to view mode.
   *
   * @param {GridRowId} id - The ID of the row to save.
   * @returns {() => void} A function to save the row and switch to view mode.
   */
  const handleSaveClick =
    (id: GridRowId): (() => void) =>
    () => {
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

  /**
   * @function handleCancelClick
   *
   * @description Cancels the editing of a specific row. If the row is new, it removes it from the state.
   *
   * @param {GridRowId} id - The ID of the row to cancel editing.
   * @returns {() => void} A function to cancel editing for the row.
   */
  const handleCancelClick =
    (id: GridRowId): (() => void) =>
    () => {
      setRowModesModel({
        ...rowModesModel,
        [id]: { mode: GridRowModes.View, ignoreModifications: true },
      });
      const editedRow = rows.find((row) => row.id === id);
      if (editedRow!.isNew) {
        setRows(rows.filter((row) => row.id !== id));
      }
    };

  /**
   * @function handleRowModesModelChange
   *
   * @description Updates the row modes model when the edit mode of a row changes.
   *
   * @param {GridRowModesModel} newRowModesModel - The updated row modes model.
   * @returns {void}
   */
  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel): void => {
    setRowModesModel(newRowModesModel);
  };

  /**
   * @function handleConfirmDialogClose
   *
   * @description Handles the confirmation dialog for deleting a row. If the user confirms, the row is deleted
   * from the database and removed from the local state.
   *
   * @param {boolean} choice - The user's choice in the confirmation dialog (true for confirm, false for cancel).
   * @returns {Promise<void>}
   */
  const handleConfirmDialogClose = async (choice: boolean): Promise<void> => {
    if (choice && itemToDelete) {
      const result = await handleData('delete', itemToDelete);
      if (result) {
        setRows(rows.filter((row) => row.id !== itemToDelete));
      }
    }
    setItemToDelete(null);
  };

  const columns: GridColDef[] = [
    ...dataColumns,
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              style={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem icon={<CancelIcon />} label="Cancel" className="textPrimary" onClick={handleCancelClick(id)} color="inherit" />,
          ];
        }

        return [
          <GridActionsCellItem icon={<EditIcon />} label="Edit" className="textPrimary" onClick={handleEditClick(id)} color="inherit" />,
          <GridActionsCellItem icon={<DeleteIcon />} label="Delete" onClick={() => handleDeleteClick(id)} color="inherit" />,
        ];
      },
    },
  ];

  return (
    <Box
      sx={{
        height: 500,
        width: '100%',
        '& .actions': {
          color: 'text.secondary',
        },
        '& .textPrimary': {
          color: 'text.primary',
        },
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        slots={{ toolbar: EditToolbar }}
        slotProps={{
          toolbar: { setRows, setRowModesModel },
        }}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: DEFAULT_TABLE_PAGE_SIZE,
            },
          },
        }}
        disableColumnFilter
        pageSizeOptions={[5, 10, 20]}
        disableRowSelectionOnClick
        onPaginationModelChange={setPaginationModel}
        onSortModelChange={setSortModel}
        sortingMode="server"
        paginationMode="server"
        rowCount={Number(count)}
        showToolbar
      />
      <ConfirmDialog
        open={itemToDelete !== null}
        onClose={handleConfirmDialogClose}
        title={t('app.message.warning')}
        text={t('app.message.deleting_item_warning')}
      />
    </Box>
  );
};

export default DataTable;
