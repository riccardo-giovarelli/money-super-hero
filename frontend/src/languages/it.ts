import { app } from './app.it';
import { authentication } from './authentication.it';
import { indoorMenu } from './indoor-menu.it';
import { settings } from './settings.it';
import { transactions } from './transactions.en';
import { userMenu } from './user-menu.it';
import { userProfile } from './user-profile.it';

export const it = {
  translation: {
    ...authentication.translation,
    ...indoorMenu.translation,
    ...userMenu.translation,
    ...userProfile.translation,
    ...app.translation,
    ...settings.translation,
    ...transactions.translation,
  },
};
