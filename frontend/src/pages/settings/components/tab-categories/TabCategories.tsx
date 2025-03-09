import { useState } from 'react';

import DataTable from '@/components/crud-data-grid/data-table/DataTable';
import { DEFAULT_TABLE_PAGE_SIZE } from '@/config/constants';
import { PaginationModelType } from '@/pages/settings/components/tab-categories/TabCategories.type';
import useCategoriesData from '@/pages/settings/hooks/useCategoriesData/useCategoriesData';
import tank from '@/utils/axios';
import { Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { GridRowId, GridSortModel, GridValidRowModel } from '@mui/x-data-grid';

const TabCategories = () => {
  const [paginationModel, setPaginationModel] = useState<PaginationModelType>({
    page: 0,
    pageSize: DEFAULT_TABLE_PAGE_SIZE,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const { categories, count, columns } = useCategoriesData(
    paginationModel.page + 1,
    paginationModel.pageSize,
    sortModel
  );

  /**
   * Handles the data operations for categories, such as saving and deleting.
   *
   * @param {string} mode - The operation mode ('save' or 'delete').
   * @param {GridRowId} id - The ID of the row to be operated on.
   * @param {GridValidRowModel} [row] - The row data to be saved (only required for 'save' mode).
   * @returns {Promise<boolean>} A promise that resolves to a boolean indicating the success of the operation.
   */
  const handleCategoriesData = async (mode: string, id: GridRowId, row?: GridValidRowModel): Promise<boolean> => {
    switch (mode) {
      case 'save': {
        if (!id) return false;
        const results = await tank.put(`/categories/${id}`, { name: row?.name, notes: row?.notes });
        return results?.data?.code && results.data.code === 'UPDATE_CATEGORY_SUCCESS';
      }
      case 'delete': {
        if (!id) return false;
        const results = await tank.delete(`/categories/${id}`);
        return results?.data?.code && results.data.code === 'DELETE_CATEGORY_SUCCESS';
      }
      default:
        return false;
    }
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
      <Grid size={{ xs: 12, md: 10 }}>
        <Box sx={{ width: '100%' }}>
          <DataTable
            data={categories}
            dataColumns={columns}
            count={Number(count)}
            setPaginationModel={setPaginationModel}
            setSortModel={setSortModel}
            handleData={handleCategoriesData}
          />
        </Box>
      </Grid>
    </Grid>
  );
};

export default TabCategories;
