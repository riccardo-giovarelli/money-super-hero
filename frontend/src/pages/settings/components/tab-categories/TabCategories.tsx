import { useState } from 'react';

import DataTable from '@/components/crud-data-grid/data-table/DataTable';
import { DEFAULT_TABLE_PAGE_SIZE } from '@/config/constants';
import { Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { GridSortModel } from '@mui/x-data-grid';

import useCategoriesData from '../../hooks/useCategoriesData/useCategoriesData';
import { PaginationModelType } from './TabCategories.type';


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
          <DataTable
            data={categories}
            dataColumns={columns}
            count={Number(count)}
            setPaginationModel={setPaginationModel}
            setSortModel={setSortModel}
          />
        </Box>
      </Grid>
    </Grid>
  );
};

export default TabCategories;
