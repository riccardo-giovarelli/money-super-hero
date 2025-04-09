import tank from '@/utils/axios';
import { isValidNumber } from '@/utils/string';
import { Container, Typography, Box, Button } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';

const TransactionsEdit = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const params = useParams();

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
        </Grid>
      </form>
    </Container>
  );
};

export default TransactionsEdit;
