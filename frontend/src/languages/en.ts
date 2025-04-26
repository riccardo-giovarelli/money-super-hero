import { app } from './app.en';
import { authentication } from './authentication.en';
import { dashboard } from './dashboard.en';
import { indoorMenu } from './indoor-menu.en';
import { settings } from './settings.en';
import { transactions } from './transactions.en';
import { userMenu } from './user-menu.en';
import { userProfile } from './user-profile.en';

export const en = {
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
