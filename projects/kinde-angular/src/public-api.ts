/*
 * Public API Surface of kinde-angular
 */

export * from './lib/kinde-angular.service';
export * from './lib/kinde-angular.module';
export * from './lib/auth.guard';
export * from './lib/feature-flag.directive';
export * from './lib/provideKinde';

export { kindeConfigToken } from './lib/tokens/config.token';

export {
  GrantType,
} from '@kinde-oss/kinde-typescript-sdk';
