import { useEffect, useState } from 'react';

import { CategoryType } from '@/models/categories';
import tank from '@/utils/axios';
import { GridColDef, GridSortModel, GridValidRowModel } from '@mui/x-data-grid';

import { CategoriesResultsType } from './useSubcategoriesData.type';

const useSubcategoriesData = (page: number, pageSize: number, sortModel: GridSortModel = []) => {
  const [columns, setColumns] = useState<GridColDef<GridValidRowModel>[]>([]);
  const [subcategoriesResults, setSubcategoriesResults] = useState<CategoriesResultsType>();

  /**
   * Fetches the category options and sets the columns
   */
  useEffect(() => {
    tank.get('/categories').then((results) => {
      if (results?.data?.code === 'GET_CATEGORIES_SUCCESS') {
        setColumns([
          {
            field: 'name',
            headerName: 'Name',
            minWidth: 150,
            flex: 1,
            editable: true,
            sortable: true,
          },
          {
            field: 'category_id',
            headerName: 'Category',
            minWidth: 150,
            flex: 1,
            editable: true,
            type: 'singleSelect',
            valueOptions: results?.data?.details?.results
              ? results?.data?.details?.results.map((category: CategoryType) => ({
                  value: category.id,
                  label: category.name,
                }))
              : [],
          },
          {
            field: 'notes',
            headerName: 'Notes',
            minWidth: 150,
            flex: 1,
            editable: true,
            sortable: true,
          },
        ]);
      }
    });
  }, []);

  /**
   * Fetches the subcategories
   */
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
  };
};

export default useSubcategoriesData;
