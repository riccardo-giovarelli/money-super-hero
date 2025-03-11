import { useEffect, useState } from 'react';

import tank from '@/utils/axios';
import { GridSortModel } from '@mui/x-data-grid';

import { CategoriesResultsType } from './useSubcategoriesData.type';


const useSubcategoriesData = (page: number, pageSize: number, sortModel: GridSortModel = []) => {
  const [subcategoriesResults, setSubcategoriesResults] = useState<CategoriesResultsType>();
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
      field: 'category_name',
      headerName: 'Category',
      minWidth: 150,
      flex: 1,
      editable: true,
      sortable: true,
    },
    {
      field: 'category_id',
      headerName: 'Category Id',
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
    category_id: false,
  };

  useEffect(() => {
    const parameters: string[] = [];
    parameters.push(`page=${page}`);
    parameters.push(`limit=${pageSize}`);
    if (sortModel.length > 0) {
      parameters.push(`sortColumn=${sortModel[0].field}`);
      parameters.push(`sortDirection=${sortModel[0].sort}`);
    }
    tank.get(`/subcategories?${parameters.join('&')}`).then((results) => {
      if (results?.data?.code === 'GET_SUB_CATEGORIES_SUCCESS') {
        setSubcategoriesResults(results?.data?.details ? results.data.details : []);
      }
    });
  }, [page, pageSize, sortModel]);
  return {
    subcategories: subcategoriesResults?.results ? subcategoriesResults.results : [],
    count: subcategoriesResults?.count ? subcategoriesResults.count : 0,
    columns,
    columnsVisibility,
  };
};

export default useSubcategoriesData;
