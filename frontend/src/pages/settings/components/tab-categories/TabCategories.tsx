import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import DataTable from '@/components/crud-data-grid/data-table/DataTable';
import { DEFAULT_TABLE_PAGE_SIZE } from '@/config/constants';
import useCategoriesData from '@/pages/settings/hooks/useCategoriesData/useCategoriesData';
import { PaginationModelType } from '@/types/pagination.type';
import tank from '@/utils/axios';
import { Box, Grid } from '@mui/material';
import { GridRowId, GridSortModel, GridValidRowModel } from '@mui/x-data-grid';

import { useSettingsStore } from '../../stores/SettingsStore';

const TabCategories = () => {
  const [paginationModel, setPaginationModel] = useState<PaginationModelType>({
    page: 0,
    pageSize: DEFAULT_TABLE_PAGE_SIZE,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const { categories, count, columns } = useCategoriesData(paginationModel.page + 1, paginationModel.pageSize, sortModel);
  const { t } = useTranslation();
  const setAlertSnackbarMessage = useSettingsStore((state) => state.setAlertSnackbarMessage);

  /**
   * Handles the data operations for categories, such as saving and deleting.
   *
   * @param {string} mode - The operation mode ('save' or 'delete').
   * @param {GridRowId} id - The ID of the row to be operated on.
   * @param {GridValidRowModel} [row] - The row data to be saved (only required for 'save' mode).
   * @returns {Promise<boolean>} A promise that resolves to a boolean indicating the success of the operation.
   */
  const handleCategoriesData = async (mode: string, id: GridRowId, row?: GridValidRowModel): Promise<number | boolean> => {
    switch (mode) {
      case 'add': {
        const results = await tank.post(`/categories`, {
          name: row?.name,
          notes: row?.notes,
        });

        const success = results?.data?.code && results.data.code === 'ADD_CATEGORY_SUCCESS' && results?.data?.details?.id;

        setAlertSnackbarMessage(
          success ? { type: 'success', text: t('settings.category_add_success') } : { type: 'error', text: t('settings.category_add_error') }
        );

        return results.data.details.id;
      }
      case 'save': {
        if (!id) return false;
        const results = await tank.put(`/categories/${id}`, {
          name: row?.name,
          notes: row?.notes,
        });
        const success = results?.data?.code && results.data.code === 'UPDATE_CATEGORY_SUCCESS' && results?.data?.details?.id;

        setAlertSnackbarMessage(
          success ? { type: 'success', text: t('settings.category_update_success') } : { type: 'error', text: t('settings.category_update_error') }
        );

        return results.data.details.id;
      }
      case 'delete': {
        if (!id) return false;
        const results = await tank.delete(`/categories/${id}`);
        const success = results?.data?.code && results.data.code === 'DELETE_CATEGORY_SUCCESS' && results?.data?.details?.id;

        setAlertSnackbarMessage(
          success ? { type: 'success', text: t('settings.category_delete_success') } : { type: 'error', text: t('settings.category_delete_error') }
        );

        return results.data.details.id;
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
