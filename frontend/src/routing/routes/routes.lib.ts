import { routesIndoor } from './routes-indoor';
import { routesOutdoor } from './routes-outdoor';
import { RoutesIndoorType, RoutesOutdoorType } from './routes.type';


/**
 * @function getRouteByField
 *
 * @description Retrieves a route from either the `routesIndoor` or `routesOutdoor` array by matching a specified field and value.
 * The function determines which array to search based on the provided type ('indoor' or 'outdoor').
 *
 * @param {keyof RoutesIndoorType | keyof RoutesOutdoorType} field - The field of the route object to match against.
 * @param {string} value - The value to match the specified field against.
 * @param {'indoor' | 'outdoor'} type - The type of route array to search ('indoor' or 'outdoor').
 * @returns {RoutesIndoorType | RoutesOutdoorType | undefined} The route object that matches the specified field and value,
 * or undefined if no match is found.
 */
export const getRouteByField = (
  field: keyof RoutesIndoorType | keyof RoutesOutdoorType,
  value: string,
  type: 'indoor' | 'outdoor'
): RoutesIndoorType | RoutesOutdoorType | undefined => {
  switch (type) {
    case 'indoor':
      return routesIndoor.find((route) => route[field as keyof RoutesIndoorType] === value);
    case 'outdoor':
      return routesOutdoor.find((route) => route[field as keyof RoutesOutdoorType] === value);
    default:
      return undefined;
  }
};
