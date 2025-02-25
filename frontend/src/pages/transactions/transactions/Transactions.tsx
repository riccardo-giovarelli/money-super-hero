import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

import TransactionsList from '../transactions-list/TransactionsList.tsx';
import TransactionsNew from '../transactions-new/TransactionsNew.tsx';
import TransactionsShow from '../transactions-show/TransactionsShow.tsx';

const Transactions = () => {
  const params = useParams();
  const [component, setComponent] = useState<JSX.Element>(<></>);

  useEffect(() => {
    if (!params.trsId) {
      setComponent(TransactionsList);
    }
    if (params.trsId === 'new') {
      setComponent(TransactionsNew);
    }
    if (_.isNumber(params.trsId)) {
      setComponent(TransactionsShow);
    }
  }, [params]);

  return { component };
};

export default Transactions;
