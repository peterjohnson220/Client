import cloneDeep from 'lodash/cloneDeep';

import { UrlParam, UrlRedirectRequest } from '../../models/url-redirect';
import { FeatureFlags } from '../services/feature-flags';
import { UrlPage } from '../../models/url-redirect/url-page';
import { GenericUrlPageMap } from './models/generic-url-page-map';
import { PageRedirectUrl } from '../../models/url-redirect/page-redirect-url';

export class UrlRedirectHelper {
  static getPricingProjectUrlRedirectRequest(projectId?: number): UrlRedirectRequest {
    if (projectId !== undefined) {
      const urlParams: UrlParam[] = [{key: 'usersession_id', value: projectId.toString()}];
      const slugFilters: string[] = [projectId.toString()];

      return {
        FeatureFlag: FeatureFlags.ProjectsPage,
        UrlParams: urlParams,
        TargetPage: UrlPage.PricingProject,
        SlugFilters: slugFilters,
        SlugOnly: true
      };
    }

    return {
      FeatureFlag: FeatureFlags.ProjectsPage,
      UrlParams: null,
      TargetPage: UrlPage.PricingProject,
      SlugFilters: null,
      SlugOnly: true
    };
  }

  static getProjectListUrlRedirectRequest(): UrlRedirectRequest {
    return {
      FeatureFlag: FeatureFlags.ProjectsPage,
      UrlParams: null,
      TargetPage: UrlPage.ProjectList,
      SlugFilters: null,
      SlugOnly: true
    };
  }

  static getSurveysUrlRedirectRequest(): UrlRedirectRequest {
    return {
      FeatureFlag: FeatureFlags.SurveysPage,
      UrlParams: null,
      TargetPage: UrlPage.Surveys,
      SlugFilters: null,
      SlugOnly: true
    };
  }

  static getStructuresUrlRedirectRequest(): UrlRedirectRequest {
    return {
      FeatureFlag: FeatureFlags.StructuresPage,
      UrlParams: null,
      TargetPage: UrlPage.Structures,
      SlugFilters: null,
      SlugOnly: true
    };
  }

  static getIdParamUrl(urlSlug: string, id: string): string {
    const isClient = urlSlug.includes('client');

    return isClient ? urlSlug + '/' + id : urlSlug + '?usersession_id=' + id;
  }

  static applyUrlOverrides<T>(input: T[], mapper: GenericUrlPageMap[], redirectUrls: PageRedirectUrl[]): T[] {
    const items: T[] = cloneDeep(input);

    redirectUrls.forEach(redirectObj => {
      const mappingIndex = mapper.findIndex(x => x.TargetPage === redirectObj.TargetPage);

      if (mappingIndex !== -1) {
        const index = items.findIndex(x => x[mapper[mappingIndex].SourceKey] === mapper[mappingIndex].SourceKeyValue);

        if (index !== -1) {
          const newItem = items[index];
          newItem[mapper[mappingIndex].SourceUrlAttributeName] = redirectObj.RedirectUrl;
          items[index] = newItem;
        }
      }
    });

    return items;
  }

}
