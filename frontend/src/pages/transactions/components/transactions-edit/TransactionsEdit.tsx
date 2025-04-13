import { CategoryType } from '@/models/categories';
import { SubategoryType } from '@/models/sub-categories';
import { TransactionType } from '@/models/transactions';
import { MessageType } from '@/types/generic.type';
import tank from '@/utils/axios';
import { isValidNumber } from '@/utils/string';
import {
  Alert,
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { TransactionsFordFieldType } from '../transactions-new/TransactionsNew.type';
import TransactionsTableColumnDirection from '../transactions-table-column-direction/TransactionsTableColumnDirection';
import { parseTransactionsApiResults } from './TransactionsEdit.lib';

const TransactionsEdit = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const params = useParams();
  const [formData, setFormData] = useState<TransactionType | null>(null);
  const [categoriesData, setCategoriesData] = useState<CategoryType[]>([]);
  const [subcategoriesData, setSubcategoriesData] = useState<SubategoryType[]>([]);
  const [message, setMessage] = useState<MessageType | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);

  // Fetch categories
  useEffect(() => {
    tank.get('/categories').then((results) => {
      if (results?.data?.code === 'GET_CATEGORIES_SUCCESS') {
        setCategoriesData(results?.data?.details?.results ? results.data.details.results : []);
      }
    });
  }, []);

  // Fetch subcategories
  useEffect(() => {
    if (formData?.category) {
      tank.get(`/subcategories/${formData.category}`).then((results) => {
        setSubcategoriesData(
          results?.data?.code === 'GET_SUB_CATEGORIES_SUCCESS' && results?.data?.details?.results ? results.data.details.results : []
        );
      });
    }
  }, [formData?.category]);

  // Fetch transaction data
  useEffect(() => {
    if (params?.trsId && isValidNumber(params.trsId)) {
      tank.get(`/transactions/${params.trsId}`).then((results) => {
        if (results?.data?.code === 'GET_TRANSACTION_SUCCESS' && results?.data?.details) {
          setFormData(parseTransactionsApiResults(results.data.details));
        }
      });
    }
  }, [params]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
  };

  /**
   * @function handleFormChange
   *
   * @description Updates the `formData` state when a form field value changes. This function dynamically updates
   *              the specified field in the `formData` object while preserving the existing values of other fields.
   *
   * @param {TransactionsFordFieldType} field - The name of the form field being updated (e.g., 'amount', 'direction', 'category').
   * @param {string} value - The new value of the form field.
   *
   * @returns {void}
   */
  const handleFormChange = (field: TransactionsFordFieldType, value: string) => {
    setFormData((prevFormData) => {
      return prevFormData
        ? {
            ...prevFormData,
            [field]: value,
          }
        : null;
    });
  };

  return (
    <Container maxWidth="lg">
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Typography variant="h5" component="h1">
              {`${t('transactions.edit_transaction.form_title')} (${
                formData?.timestamp ? dayjs(formData?.timestamp).format('DD/MM/YYYY - HH:mm') : ''
              })`}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box display="flex" flexDirection="row" alignItems="center" justifyContent={{ xs: 'start', md: 'end' }} gap={2}>
              {editMode && (
                <Button variant="contained" color="primary" type="submit">
                  {t('transactions.edit_transaction.save_button.label')}
                </Button>
              )}
              {!editMode && (
                <Button variant="contained" color="primary" onClick={() => setEditMode(true)}>
                  {t('transactions.edit_transaction.edit_button.label')}
                </Button>
              )}
              {editMode && (
                <Button
                  variant="contained"
                  onClick={() => {
                    setEditMode(false);
                  }}
                  color="secondary"
                >
                  {t('transactions.edit_transaction.cancel_button.label')}
                </Button>
              )}
              {!editMode && (
                <Button
                  variant="contained"
                  onClick={() => {
                    navigate('/transactions');
                  }}
                  color="secondary"
                >
                  {t('transactions.edit_transaction.back_button.label')}
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ marginTop: 4 }}>
          <Grid size={12}>
            {/* Date Time */}
            <Typography variant="h4" gutterBottom></Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            {/* Amount */}
            <FormControl fullWidth>
              <TextField
                id="amount"
                type="number"
                label={t('transactions.add_transaction.amount.label')}
                variant="outlined"
                value={formData?.amount ? formData.amount : ''}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  handleFormChange('amount', event.target.value);
                }}
                required={editMode}
                slotProps={{
                  input: {
                    readOnly: !editMode,
                  },
                }}
              />
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            {/* Direction */}
            <FormControl
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                columnGap: 2,
              }}
            >
              {editMode && (
                <>
                  <FormLabel id="direction-radio-buttons-group-label">{t('transactions.add_transaction.direction.label')}</FormLabel>
                  <RadioGroup
                    row
                    id="direction"
                    name="direction"
                    aria-labelledby="direction-radio-buttons-group-label"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      handleFormChange('direction', (event.target as HTMLInputElement).value);
                    }}
                    value={formData?.direction ? formData.direction : ''}
                    sx={{
                      paddingX: 1,
                    }}
                  >
                    <FormControlLabel value="IN" control={<Radio required />} label={t('transactions.add_transaction.direction.in')} />
                    <FormControlLabel value="OUT" control={<Radio required />} label={t('transactions.add_transaction.direction.out')} />
                  </RadioGroup>
                </>
              )}
              {!editMode && (
                <>
                  <Typography variant="body1" component="div">
                    {t('transactions.add_transaction.direction.label')}
                  </Typography>
                  <Box
                    sx={{
                      paddingX: 0.8,
                      paddingY: 0.4,
                    }}
                  >
                    <TransactionsTableColumnDirection direction={formData?.direction} />
                  </Box>
                </>
              )}
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            {/* Category */}
            <FormControl fullWidth>
              <InputLabel id="category-select-name-label">{t('transactions.add_transaction.category.label')}</InputLabel>
              <Select
                labelId="category-select-name-label"
                id="category"
                value={formData?.category ? formData.category.toString() : ''}
                onChange={(event: SelectChangeEvent<string>) => {
                  handleFormChange('category', event.target.value);
                }}
                input={<OutlinedInput label={`${t('transactions.add_transaction.category.label')} *`} />}
                required={editMode}
                slotProps={{
                  input: {
                    readOnly: !editMode,
                  },
                }}
              >
                {categoriesData.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            {/* Subcategory */}
            <FormControl fullWidth>
              <InputLabel id="sub-category-select-name-label">
                {subcategoriesData.length === 0
                  ? t('transactions.add_transaction.subcategory.no_data')
                  : t('transactions.add_transaction.subcategory.label')}
              </InputLabel>
              <Select
                labelId="sub-category-select-name-label"
                id="sub-category"
                value={formData?.subCategory ? formData.subCategory.toString() : ''}
                onChange={(event: SelectChangeEvent<string>) => {
                  handleFormChange('subcategory', event.target.value);
                }}
                input={<OutlinedInput label={t('transactions.add_transaction.category.label')} />}
                disabled={subcategoriesData.length === 0}
                slotProps={{
                  input: {
                    readOnly: !editMode,
                  },
                }}
              >
                {subcategoriesData.map((subcategory) => (
                  <MenuItem key={subcategory.id} value={subcategory.id}>
                    {subcategory.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={12}>
            <FormControl fullWidth>
              <TextField
                id="filled-multiline-static"
                label={t('transactions.add_transaction.notes.label')}
                multiline
                rows={5}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  handleFormChange('notes', event.target.value);
                }}
                value={formData?.notes ? formData.notes : ''}
                slotProps={{
                  input: {
                    readOnly: !editMode,
                  },
                }}
              />
            </FormControl>
          </Grid>
        </Grid>
      </form>
      {message && (
        <Alert
          sx={{ marginTop: 3 }}
          severity={message.type}
          onClose={() => {
            setMessage(null);
          }}
        >
          {message.text}
        </Alert>
      )}
    </Container>
  );
};

export default TransactionsEdit;
