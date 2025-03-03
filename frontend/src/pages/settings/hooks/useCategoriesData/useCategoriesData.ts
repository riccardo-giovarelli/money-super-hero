import { useEffect, useState } from 'react';

import { CategoryType } from '@/models/categories';
import tank from '@/utils/axios';
import { GridColDef, GridSortModel } from '@mui/x-data-grid';

import { CategoriesResultsType } from './useCategoriesData.type';

const useCategoriesData = (page: number, pageSize: number, sortModel: GridSortModel = []) => {
  const [categoriesResults, setCategoriesResults] = useState<CategoriesResultsType>();
  const columns: GridColDef<CategoryType>[] = [
    { field: 'id', headerName: 'ID', width: 90, sortable: true },
    {
      field: 'name',
      headerName: 'Name',
      minWidth: 150,
      editable: true,
      sortable: true,
    },
    {
      field: 'notes',
      headerName: 'Notes',
      minWidth: 150,
      editable: true,
      sortable: true,
    },
  ];

  useEffect(() => {
    const parameters: string[] = [];
    parameters.push(`page=${page}`);
    parameters.push(`limit=${pageSize}`);
    if (sortModel.length > 0) {
      parameters.push(`sortColumn=${sortModel[0].field}`);
      parameters.push(`sortDirection=${sortModel[0].sort}`);
    }
    tank.get(`/categories?${parameters.join('&')}`).then((results) => {
      if (results?.data?.code === 'GET_CATEGORIES_SUCCESS') {
        setCategoriesResults(results?.data?.details ? results.data.details : []);
      }
    });
  }, [page, pageSize, sortModel]);

  return {
    categories: categoriesResults?.results ? categoriesResults.results : [],
    count: categoriesResults?.count ? categoriesResults.count : 0,
    columns,
  };
};

export default useCategoriesData;
