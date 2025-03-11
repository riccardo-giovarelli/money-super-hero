import { useEffect, useState } from 'react';

import tank from '@/utils/axios';
import { GridSortModel } from '@mui/x-data-grid';

import { CategoriesResultsType } from './useCategoriesData.type';


const useCategoriesData = (page: number, pageSize: number, sortModel: GridSortModel = []) => {
  const [categoriesResults, setCategoriesResults] = useState<CategoriesResultsType>();
  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 100,
      sortable: true,
    },
    {
      field: 'name',
      headerName: 'Name',
      minWidth: 150,
      flex: 1,
      editable: true,
      sortable: true,
    },
    {
      field: 'notes',
      headerName: 'Notes',
      minWidth: 150,
      flex: 1,
      editable: true,
      sortable: true,
    },
  ];
  const columnsVisibility = {
    id: false,
  };

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
    columnsVisibility,
  };
};

export default useCategoriesData;
