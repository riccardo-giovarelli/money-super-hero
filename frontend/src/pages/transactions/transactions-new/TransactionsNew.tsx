import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { CategoryType } from '@/models/categories';
import { SubategoryType } from '@/models/sub-categories';
import tank from '@/utils/axios';
import {
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

import {
  TransactionsFordFieldType,
  TransactionsFormDataType,
  transactionsFormDefaultData,
} from './TransactionsNew.type';

const TransactionsNew = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<TransactionsFormDataType>(transactionsFormDefaultData);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [subcategories, setSubcategories] = useState<SubategoryType[]>([]);

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
        setSubcategories(
          results?.data?.code === 'GET_SUB_CATEGORIES_SUCCESS' && results?.data?.details?.results
            ? results.data.details.results
            : []
        );
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
    console.log('field', field, 'value', value);
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));
  };

  return (
    <Container maxWidth="lg">
      <Grid container spacing={2}>
        <Grid size={12}>
          <Typography variant="h5" component="h1" sx={{ borderBottom: 1, mb: 2 }}>
            {t('transactions.add_transaction.form_title')}
          </Typography>
        </Grid>
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
            <FormLabel id="direction-radio-buttons-group-label">
              {t('transactions.add_transaction.direction.label')} *
            </FormLabel>
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
              <FormControlLabel
                value="IN"
                control={<Radio />}
                label={t('transactions.add_transaction.direction.in')}
              />
              <FormControlLabel
                value="OUT"
                control={<Radio />}
                label={t('transactions.add_transaction.direction.out')}
              />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {/* Category */}
          <FormControl fullWidth>
            <InputLabel id="category-select-name-label">
              {t('transactions.add_transaction.category.label')} *
            </InputLabel>
            <Select
              labelId="category-select-name-label"
              id="category"
              value={formData.category}
              onChange={(event: SelectChangeEvent<string>) => {
                handleFormChange('category', event.target.value);
              }}
              input={
                <OutlinedInput label={`${t('transactions.add_transaction.category.label')} *`} />
              }
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
      </Grid>
    </Container>
  );
};

export default TransactionsNew;
