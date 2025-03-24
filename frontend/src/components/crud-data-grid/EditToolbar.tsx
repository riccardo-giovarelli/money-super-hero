import { useTranslation } from 'react-i18next';

import AddIcon from '@mui/icons-material/Add';
import { Box, Button } from '@mui/material';
import { GridRowModes, GridSlotProps, GridToolbarContainer } from '@mui/x-data-grid';
import { randomId } from '@mui/x-data-grid-generator';

const EditToolbar = (props: GridSlotProps['toolbar']) => {
  const { setRows, setRowModesModel } = props;
  const { t } = useTranslation();

  const handleClick = () => {
    const id = randomId();
    setRows((oldRows) => [...oldRows, { id, name: '', notes: '', isNew: true }]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
    }));
  };

  return (
    <GridToolbarContainer>
      <Box sx={{ flexGrow: 1 }} />
      <Button color="primary" startIcon={<AddIcon />} variant="outlined" onClick={handleClick}>
        {t('app.data_table.add_record')}
      </Button>
    </GridToolbarContainer>
  );
};

export default EditToolbar;
