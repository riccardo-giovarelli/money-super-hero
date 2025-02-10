import { authentication } from './authentication.it';
import { indoorMenu } from './indoor-menu.it';


export const it = {
  translation: { ...authentication.translation, ...indoorMenu.translation },
};
