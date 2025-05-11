import dayjs from 'dayjs';

export const dashboardStoreDefault = {
  from: dayjs().startOf('month'),
  to: dayjs().endOf('month'),
};
