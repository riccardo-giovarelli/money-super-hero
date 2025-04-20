import { CategoryType } from '@/models/categories';
import { SubategoryType } from '@/models/sub-categories';
import { TransactionType } from '@/models/transactions';
import { MessageType } from '@/types/generic.type';
import tank from '@/utils/axios';
import { isValidNumber } from '@/utils/string';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
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
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { TransactionsFordFieldType } from '../transactions-new/TransactionsNew.type';
import TransactionsValues from '../transactions-values/TransactionsValues';
import { parseTransactionsApiResults } from './TransactionsEdit.lib';
import AlertSnackbar from '@/components/alert-snackbar/AlertSnackbar';

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
    const { amount, direction, category, subcategory, notes, id } = formData || {};
    tank
      .put(`/transactions/${id}`, {
        amount: amount || null,
        category: category || null,
        direction: direction || null,
        subcategory: subcategory || null,
        notes: notes || null,
      })
      .then((results) => {
        if (!results?.data?.code || results.data.code !== 'EDIT_TRANSACTION_SUCCESS') {
          setMessage({
            type: 'error',
            text: t('transactions.edit_transaction.result.error'),
          });
        } else {
          setMessage({
            type: 'success',
            text: t('transactions.edit_transaction.result.success'),
          });
          setEditMode(false);
        }
      });
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
              {formData?.timestamp ? dayjs(formData?.timestamp).format('DD/MM/YYYY - HH:mm') : ''}
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
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setEditMode(true);
                    setMessage(null);
                  }}
                >
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
            {editMode && (
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
                />
              </FormControl>
            )}
            {!editMode && <TransactionsValues type={'text'} label={t('transactions.add_transaction.amount.label')} value={formData?.amount} />}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            {/* Direction */}
            {editMode && (
              <FormControl
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  columnGap: 2,
                }}
              >
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
              </FormControl>
            )}
            {!editMode && (
              <TransactionsValues type={'direction'} label={t('transactions.add_transaction.direction.label')} value={formData?.direction} />
            )}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            {/* Category */}
            {editMode && (
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
                >
                  {categoriesData.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            {!editMode && (
              <TransactionsValues
                type={'text'}
                label={t('transactions.add_transaction.category.label')}
                value={formData?.category && categoriesData.find((category) => category.id === formData.category)?.name}
              />
            )}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            {/* Subcategory */}
            {editMode && (
              <FormControl fullWidth>
                <InputLabel id="sub-category-select-name-label">
                  {subcategoriesData.length === 0
                    ? t('transactions.add_transaction.subcategory.no_data')
                    : t('transactions.add_transaction.subcategory.label')}
                </InputLabel>
                <Select
                  labelId="sub-category-select-name-label"
                  id="sub-category"
                  value={formData?.subcategory ? formData.subcategory.toString() : ''}
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
            )}
            {!editMode && (
              <TransactionsValues
                type={'text'}
                label={t('transactions.add_transaction.category.label')}
                value={formData?.subcategory && subcategoriesData.find((subcategory) => subcategory.id === formData.subcategory)?.name}
              />
            )}
          </Grid>
          <Grid size={12}>
            {editMode && (
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
            )}
            {!editMode && <TransactionsValues type={'textArea'} label={t('transactions.add_transaction.notes.label')} value={formData?.notes} />}
          </Grid>
        </Grid>
      </form>
      <AlertSnackbar
        message={message?.text ? message.text : ''}
        autoHideDuration={5000}
        severity={message?.type}
        open={message !== null}
        onClose={() => setMessage(null)}
      />
    </Container>
  );
};

export default TransactionsEdit;
