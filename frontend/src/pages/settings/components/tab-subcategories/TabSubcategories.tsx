import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { DataTable } from '@/components/crud-data-grid';
import { DEFAULT_TABLE_PAGE_SIZE } from '@/config/constants';
import useSubcategoriesData from '@/pages/settings/hooks/useSubcategoriesData/useSubcategoriesData';
import { PaginationModelType } from '@/types/pagination.type';
import tank from '@/utils/axios';
import { Box, Grid } from '@mui/material';
import { GridRowId, GridSortModel, GridValidRowModel } from '@mui/x-data-grid';

import { useSettingsStore } from '../../stores/SettingsStore';

const TabSubcategories = () => {
  const [paginationModel, setPaginationModel] = useState<PaginationModelType>({
    page: 0,
    pageSize: DEFAULT_TABLE_PAGE_SIZE,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const { subcategories, count, columns } = useSubcategoriesData(paginationModel.page + 1, paginationModel.pageSize, sortModel);
  const { t } = useTranslation();
  const setAlertSnackbarMessage = useSettingsStore((state) => state.setAlertSnackbarMessage);

  const handleSubcategoriesData = async (mode: string, id: GridRowId, row?: GridValidRowModel): Promise<boolean> => {
    switch (mode) {
      case 'add': {
        const results = await tank.post(`/subcategories`, {
          name: row?.name,
          notes: row?.notes,
          category_id: row?.category_id,
        });

        const success = results?.data?.code && results.data.code === 'ADD_SUB_CATEGORY_SUCCESS' && results?.data?.details?.id;

        setAlertSnackbarMessage(
          success ? { type: 'success', text: t('settings.subcategory_add_success') } : { type: 'error', text: t('settings.subcategory_add_error') }
        );

        return results.data.details.id;
      }
      case 'save': {
        if (!id) return false;
        const results = await tank.put(`/subcategories/${id}`, {
          name: row?.name,
          notes: row?.notes,
          category_id: row?.category_id,
        });
        const success = results?.data?.code && results.data.code === 'UPDATE_SUB_CATEGORY_SUCCESS' && results?.data?.details?.id;

        setAlertSnackbarMessage(
          success
            ? { type: 'success', text: t('settings.subcategory_update_success') }
            : { type: 'error', text: t('settings.subcategory_update_error') }
        );

        return results.data.details.id;
      }
      case 'delete': {
        if (!id) return false;
        const results = await tank.delete(`/subcategories/${id}`);
        const success = results?.data?.code && results.data.code === 'DELETE_SUB_CATEGORY_SUCCESS' && results?.data?.details?.id;

        setAlertSnackbarMessage(
          success
            ? { type: 'success', text: t('settings.subcategory_delete_success') }
            : { type: 'error', text: t('settings.subcategory_delete_error') }
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
            data={subcategories}
            dataColumns={columns}
            count={Number(count)}
            setPaginationModel={setPaginationModel}
            setSortModel={setSortModel}
            handleData={handleSubcategoriesData}
          />
        </Box>
      </Grid>
    </Grid>
  );
};

export default TabSubcategories;
