import { authentication } from './authentication.en';
import { indoorMenu } from './indoor-menu.en';
import { userMenu } from './user-menu.en';
import { userProfile } from './user-profile.en';


export const en = {
  translation: {
    ...authentication.translation,
    ...indoorMenu.translation,
    ...userMenu.translation,
    ...userProfile.translation,
  },
};
