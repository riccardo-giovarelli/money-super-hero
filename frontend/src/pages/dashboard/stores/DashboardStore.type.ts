import { Dayjs } from 'dayjs';

export interface DashboardState {
  from: Dayjs | null;
  to: Dayjs | null;
}

export interface DashboardAction {
  setFrom: (from: Dayjs | null) => void;
  setTo: (to: Dayjs | null) => void;
}
