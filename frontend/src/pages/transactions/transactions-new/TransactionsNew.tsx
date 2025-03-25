import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material';
import Grid from '@mui/material/Grid2';

import { TransactionsFordFieldType, TransactionsFormDataType } from './TransactionsNew.type';

const TransactionsNew = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<TransactionsFormDataType>({ amount: '', direction: '' });

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
    <Grid container spacing={2}>
      <Grid size={6}>
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
      <Grid size={6}>
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
          <FormLabel id="ddirection-radio-buttons-group-label">
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
    </Grid>
  );
};

export default TransactionsNew;
