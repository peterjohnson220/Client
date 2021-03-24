import { UrlPage } from '../../../models/url-redirect/url-page';

export interface GenericUrlPageMap {
  SourceKey: string;
  SourceKeyValue: string;
  SourceUrlAttributeName: string;
  TargetPage: UrlPage;
}
