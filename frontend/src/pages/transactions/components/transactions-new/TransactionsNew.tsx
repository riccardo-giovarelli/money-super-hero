import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { CategoryType } from '@/models/categories';
import { SubategoryType } from '@/models/sub-categories';
import { MessageType } from '@/types/generic.type';
import tank from '@/utils/axios';
import {
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
  Grid,
} from '@mui/material';

import { TransactionsFordFieldType, TransactionsFormDataType, transactionsFormDefaultData } from './TransactionsNew.type';
import AlertSnackbar from '@/components/alert-snackbar/AlertSnackbar';

const TransactionsNew = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<TransactionsFormDataType>(transactionsFormDefaultData);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [subcategories, setSubcategories] = useState<SubategoryType[]>([]);
  const [message, setMessage] = useState<MessageType | null>(null);

  // Reset form data when the component mounts
  useEffect(() => {
    setFormData(transactionsFormDefaultData);
  }, []);

  // Fetch categories
  useEffect(() => {
    tank.get('/categories').then((results) => {
      if (results?.data?.code === 'GET_CATEGORIES_SUCCESS') {
        setCategories(results?.data?.details?.results ? results.data.details.results : []);
      }
    });
  }, []);

  // Fetch subcategories
  useEffect(() => {
    if (formData.category) {
      tank.get(`/subcategories/${formData.category}`).then((results) => {
        setSubcategories(results?.data?.code === 'GET_SUB_CATEGORIES_SUCCESS' && results?.data?.details?.results ? results.data.details.results : []);
      });
    }
  }, [formData.category]);

  /**
   * @function handleFormChange
   *
   * @description Updates the form data state when a form field value changes.
   *
   * @param {TransactionsFordFieldType} field - The name of the form field being updated (e.g., 'amount', 'direction').
   * @param {string} value - The new value of the form field.
   */
  const handleFormChange = (field: TransactionsFordFieldType, value: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));
  };

  /**
   * @function handleSubmit
   *
   * @description Handles the form submission for creating a new transaction. Prevents the default form submission behavior,
   *              sends the form data to the server, and displays a success or error message based on the server's response.
   *
   * @param {React.FormEvent<HTMLFormElement>} event - The form submission event.
   * @returns {void}
   */
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const { amount, category, direction, subcategory, notes } = formData;
    tank
      .post('/transactions', {
        amount: amount || null,
        category: category || null,
        direction: direction || null,
        subcategory: subcategory || null,
        notes: notes || null,
      })
      .then((results) => {
        if (!results?.data?.code || results.data.code !== 'ADD_TRANSACTION_SUCCESS') {
          setMessage({
            type: 'error',
            text: t('transactions.add_transaction.result.error'),
          });
        } else {
          setMessage({
            type: 'success',
            text: t('transactions.add_transaction.result.success'),
          });
          setFormData(transactionsFormDefaultData);
        }
      });
  };

  return (
    <Container maxWidth="lg">
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid size={8}>
            <Typography variant="h5" component="h1">
              {t('transactions.add_transaction.form_title')}
            </Typography>
          </Grid>
          <Grid size={4}>
            <Box display="flex" flexDirection="row" alignItems="center" justifyContent={{ xs: 'start', md: 'end' }} gap={2}>
              <Button variant="contained" type="submit">
                {t('transactions.add_transaction.save_button.label')}
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  navigate('/transactions');
                }}
                color="secondary"
              >
                {t('transactions.add_transaction.cancel_button.label')}
              </Button>
            </Box>
          </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ marginTop: 4 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            {/* Amount */}
            <FormControl fullWidth>
              <TextField
                id="amount"
                type="number"
                label={t('transactions.add_transaction.amount.label')}
                variant="outlined"
                value={formData.amount}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  handleFormChange('amount', event.target.value);
                }}
                required
              />
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            {/* Direction */}
            <FormControl
              fullWidth
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                alignContent: 'center',
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
                value={formData.direction}
              >
                <FormControlLabel value="IN" control={<Radio required />} label={t('transactions.add_transaction.direction.in')} />
                <FormControlLabel value="OUT" control={<Radio required />} label={t('transactions.add_transaction.direction.out')} />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            {/* Category */}
            <FormControl fullWidth>
              <InputLabel id="category-select-name-label">{t('transactions.add_transaction.category.label')} *</InputLabel>
              <Select
                labelId="category-select-name-label"
                id="category"
                value={formData.category}
                onChange={(event: SelectChangeEvent<string>) => {
                  handleFormChange('category', event.target.value);
                }}
                input={<OutlinedInput label={`${t('transactions.add_transaction.category.label')} *`} />}
                required
              >
                {categories.map((category) => (
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
                {subcategories.length === 0
                  ? t('transactions.add_transaction.subcategory.no_data')
                  : t('transactions.add_transaction.subcategory.label')}
              </InputLabel>
              <Select
                labelId="sub-category-select-name-label"
                id="sub-category"
                value={formData.subcategory}
                onChange={(event: SelectChangeEvent<string>) => {
                  handleFormChange('subcategory', event.target.value);
                }}
                input={<OutlinedInput label={t('transactions.add_transaction.category.label')} />}
                disabled={subcategories.length === 0}
              >
                {subcategories.map((subcategory) => (
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
                value={formData.notes}
              />
            </FormControl>
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

export default TransactionsNew;
