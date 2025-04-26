import { transactions } from './transactions.it';
import { app } from './app.it';
import { authentication } from './authentication.it';
import { indoorMenu } from './indoor-menu.it';
import { settings } from './settings.it';
import { userMenu } from './user-menu.it';
import { userProfile } from './user-profile.it';
import { dashboard } from './dashboard.it';

export const it = {
  translation: {
    ...authentication.translation,
    ...indoorMenu.translation,
    ...userMenu.translation,
    ...userProfile.translation,
    ...app.translation,
    ...settings.translation,
    ...transactions.translation,
    ...dashboard.translation,
  },
};
