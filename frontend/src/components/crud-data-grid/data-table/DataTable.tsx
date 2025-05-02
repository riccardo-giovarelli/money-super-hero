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

  // Update/Add the row in the database
  const processRowUpdate = async (newRow: GridRowModel) => {
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

  // Delete the row from the database
  const handleDeleteClick = async (id: GridRowId) => {
    setItemToDelete(id);
  };

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
    const editedRow = rows.find((row) => row.id === id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const handleConfirmDialogClose = async (choice: boolean) => {
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
