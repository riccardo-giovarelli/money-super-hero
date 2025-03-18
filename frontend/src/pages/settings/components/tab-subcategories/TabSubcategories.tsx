import { useState } from 'react';

import { DataTable } from '@/components/crud-data-grid';
import { DEFAULT_TABLE_PAGE_SIZE } from '@/config/constants';
import useSubcategoriesData from '@/pages/settings/hooks/useSubcategoriesData/useSubcategoriesData';
import { PaginationModelType } from '@/types/pagination.type';
import { Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { GridSortModel } from '@mui/x-data-grid';

const TabSubcategories = () => {
  const [paginationModel, setPaginationModel] = useState<PaginationModelType>({
    page: 0,
    pageSize: DEFAULT_TABLE_PAGE_SIZE,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const { subcategories, count, columns, columnsVisibility } = useSubcategoriesData(
    paginationModel.page + 1,
    paginationModel.pageSize,
    sortModel
  );

  const handleSubcategoriesData = async (): Promise<boolean> => {
    return false;
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
            columnVisibilityModel={columnsVisibility}
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
