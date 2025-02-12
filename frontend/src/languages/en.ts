import { authentication } from './authentication.en';
import { indoorMenu } from './indoor-menu.en';
import { userMenu } from './user-menu.en';


export const en = {
  translation: { ...authentication.translation, ...indoorMenu.translation, ...userMenu.translation },
};
