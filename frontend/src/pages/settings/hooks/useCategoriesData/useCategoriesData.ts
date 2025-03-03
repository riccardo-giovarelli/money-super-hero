import { useEffect, useState } from 'react';

import { CategoryType } from '@/models/categories';
import tank from '@/utils/axios';
import { GridColDef } from '@mui/x-data-grid';

const useCategoriesData = () => {
  const [categories, setCategories] = useState<CategoryType[]>([]);

  const columns: GridColDef<CategoryType>[] = [
    { field: 'id', headerName: 'ID', width: 90, sortable: false },
    {
      field: 'name',
      headerName: 'Name',
      width: 150,
      editable: true,
      sortable: false,
    },
    {
      field: 'notes',
      headerName: 'Notes',
      width: 150,
      editable: true,
      sortable: false,
    },
  ];

  useEffect(() => {
    tank.get('/categories').then((results) => {
      if (results?.data?.code === 'GET_CATEGORIES_SUCCESS') {
        setCategories(results?.data?.details ? results.data.details : []);
      }
    });
  }, []);

  return { categories, columns };
};

export default useCategoriesData;
