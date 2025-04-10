import tank from '@/utils/axios';
import { isValidNumber } from '@/utils/string';
import {
  Container,
  Typography,
  Box,
  Button,
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
  Alert,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { TransactionsFordFieldType, TransactionsFormDataType, transactionsFormDefaultData } from '../transactions-new/TransactionsNew.type';
import { CategoryType } from '@/models/categories';
import { SubategoryType } from '@/models/sub-categories';
import { MessageType } from '@/types/generic.type';

const TransactionsEdit = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const params = useParams();
  const [formData, setFormData] = useState<TransactionsFormDataType>(transactionsFormDefaultData);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [subcategories, setSubcategories] = useState<SubategoryType[]>([]);
  const [message, setMessage] = useState<MessageType | null>(null);

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

  useEffect(() => {
    if (params?.trsId && isValidNumber(params.trsId)) {
      tank.get(`/transactions/${params.trsId}`).then((results) => {
        console.log(results);
      });
    }
  }, [params]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
  };

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

  return (
    <Container maxWidth="lg">
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid size={8}>
            <Typography variant="h5" component="h1">
              {`${t('transactions.edit_transaction.form_title')} - ID ${params?.trsId}`}
            </Typography>
          </Grid>
          <Grid size={4}>
            <Box display="flex" flexDirection="row" alignItems="center" justifyContent="end" gap={2}>
              <Button variant="contained" type="submit">
                {t('transactions.edit_transaction.save_button.label')}
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  navigate('/transactions');
                }}
                color="secondary"
              >
                {t('transactions.edit_transaction.cancel_button.label')}
              </Button>
            </Box>
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
