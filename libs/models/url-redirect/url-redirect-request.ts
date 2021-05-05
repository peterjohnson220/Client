import { UrlParam } from './url-param';

export interface UrlRedirectRequest {
  FeatureFlag: string;
  UrlParams: UrlParam[];
  TargetPage: string;
  SlugFilters: string[];
  SlugOnly: boolean;
}
