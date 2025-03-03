import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import useCategoriesData from '../../hooks/useCategoriesData/useCategoriesData';

const TabCategories = () => {
  const { categories, columns } = useCategoriesData();

  return (
    <Box sx={{ width: '100%' }}>
      <DataGrid
        rows={categories}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5, 10, 20]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
};

export default TabCategories;
