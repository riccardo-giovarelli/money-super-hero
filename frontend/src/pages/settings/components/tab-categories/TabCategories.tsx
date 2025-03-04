import { useState } from 'react';

import { Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { DataGrid, GridColDef, GridRowId, GridRowModel, GridSortModel, GridValidRowModel } from '@mui/x-data-grid';

import useCategoriesData from '../../hooks/useCategoriesData/useCategoriesData';

const TabCategories = () => {
  const DEFAULT_PAGE_SIZE = 10;
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: DEFAULT_PAGE_SIZE });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const { categories, count, columns } = useCategoriesData(
    paginationModel.page + 1,
    paginationModel.pageSize,
    sortModel
  );

  const handleRowUpdate = async (newRow: GridRowModel, previousRow: GridRowModel, properties: { rowId: GridRowId }) => {
    console.log(newRow, previousRow, properties);
    return newRow;
  };

  return (
    <Grid
      container
      spacing={1}
      sx={{
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Grid size={{ xs: 12, md: 10, lg: 8, xl: 6 }}>
        <Box sx={{ width: '100%' }}>
          <DataGrid
            rows={categories}
            columns={columns as GridColDef<GridValidRowModel>[]}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: DEFAULT_PAGE_SIZE,
                },
              },
            }}
            disableColumnFilter
            pageSizeOptions={[5, 10, 20]}
            disableRowSelectionOnClick
            onPaginationModelChange={setPaginationModel}
            onSortModelChange={setSortModel}
            sortingMode='server'
            paginationMode='server'
            rowCount={Number(count)}
            editMode='row'
            processRowUpdate={handleRowUpdate}
          />
        </Box>
      </Grid>
    </Grid>
  );
};

export default TabCategories;
