import { useTranslation } from 'react-i18next';

import AddIcon from '@mui/icons-material/Add';
import { Box, Button } from '@mui/material';
import { GridRowModes, GridSlotProps, Toolbar } from '@mui/x-data-grid';
import { randomId } from '@mui/x-data-grid-generator';

const EditToolbar = (props: GridSlotProps['toolbar']) => {
  const { setRows, setRowModesModel } = props;
  const { t } = useTranslation();

  /**
   * @function handleClick
   *
   * @description Handles the addition of a new row to the data grid. Generates a random ID for the new row,
   * sets it to edit mode, and focuses on the "name" field. Updates the rows and row modes model state accordingly.
   *
   * @returns {void}
   *
   */
  const handleClick = () => {
    const id = randomId();
    setRows((oldRows) => [...oldRows, { id, name: '', notes: '', isNew: true }]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
    }));
  };

  return (
    <Toolbar>
      <Box sx={{ flexGrow: 1 }} />
      <Button color="primary" startIcon={<AddIcon />} variant="outlined" onClick={handleClick}>
        {t('app.data_table.add_record')}
      </Button>
    </Toolbar>
  );
};

export default EditToolbar;
