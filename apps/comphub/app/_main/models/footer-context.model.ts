import { ComphubPages } from '../data';
import { JobData } from './job-data.model';
import { DojGuidelinesService } from 'libs/features/peer/guidelines-badge/services/doj-guidelines.service';

export interface FooterContext {
  HideBackButton: boolean;
  BackButtonEnabled: boolean;
  HideNextButton: boolean;
  NextButtonEnabled: boolean;
  PageTitle: string;
  PreviousPageTitle: string;
  NextPageTitle: string;
}

export interface FooterContextRequest {
  PageId: ComphubPages;
  JobPricingBlocked: boolean;
  JobSelected: boolean;
  JobDataSelected: boolean;
  IsPeerQuickPriceType: boolean;
}

export class FooterHelper {
  static jobsFooterContext(jobPricingBlocked: boolean, jobSelected: boolean): FooterContext {
    return {
      HideBackButton: true,
      BackButtonEnabled: false,
      HideNextButton: false,
      NextButtonEnabled: !jobPricingBlocked && !!jobSelected,
      PageTitle: 'Jobs',
      PreviousPageTitle: null,
      NextPageTitle: 'Markets'
    };
  }
  static marketsFooterContext(): FooterContext {
    return {
      HideBackButton: false,
      BackButtonEnabled: true,
      HideNextButton: false,
      NextButtonEnabled: true,
      PageTitle: 'Markets',
      PreviousPageTitle: 'Jobs',
      NextPageTitle: 'Data'
    };
  }
  static dataFooterContext(jobDataSelected: boolean): FooterContext {
    return {
      HideBackButton: false,
      BackButtonEnabled: true,
      HideNextButton: false,
      NextButtonEnabled: jobDataSelected,
      PageTitle: 'Data',
      PreviousPageTitle: 'Markets',
      NextPageTitle: 'Summary'
    };
  }
  static summaryFooterContext(isPeerQuickPriceType: boolean): FooterContext {
    return {
      HideBackButton: isPeerQuickPriceType,
      BackButtonEnabled: true,
      HideNextButton: true,
      NextButtonEnabled: false,
      PageTitle: 'Summary',
      PreviousPageTitle: 'Data',
      NextPageTitle: null
    };
  }

  static getFooterContext(request: FooterContextRequest): FooterContext {
    switch (request.PageId) {
      case ComphubPages.Jobs:
        return this.jobsFooterContext(request.JobPricingBlocked, request.JobSelected);
      case ComphubPages.Markets:
        return this.marketsFooterContext();
      case ComphubPages.Data:
        return this.dataFooterContext(request.JobDataSelected);
      case ComphubPages.Summary:
        return this.summaryFooterContext(request.IsPeerQuickPriceType);
      default:
        return null;
    }
  }
}

export function generateMockFooterContext(): FooterContext {
  return {
    HideBackButton: true,
    BackButtonEnabled: false,
    HideNextButton: false,
    NextButtonEnabled: false,
    PageTitle: 'Jobs',
    PreviousPageTitle: '',
    NextPageTitle: 'Markets'
  };
}
