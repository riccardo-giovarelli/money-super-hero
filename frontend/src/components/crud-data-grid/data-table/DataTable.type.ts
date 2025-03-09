import { PaginationModelType } from '@/pages/settings/components/tab-categories/TabCategories.type';
import { GridColDef, GridRowId, GridRowsProp, GridSortModel, GridValidRowModel } from '@mui/x-data-grid';

export interface DataTablePropsType {
  data: GridRowsProp;
  dataColumns: GridColDef<GridValidRowModel>[];
  count: number;
  setPaginationModel: (item: PaginationModelType) => void;
  setSortModel: (item: GridSortModel) => void;
  handleData: (mode: string, id: GridRowId, row?: GridValidRowModel) => Promise<boolean>;
}
