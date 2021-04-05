import { ComphubPages, TrendsPages } from '../data';

export interface FooterContext {
  HideBackButton: boolean;
  BackButtonEnabled: boolean;
  HideNextButton: boolean;
  NextButtonEnabled: boolean;
  PageTitle: string;
  PreviousPageTitle: string;
  NextPageTitle: string;
  DisplayCancelButton: boolean;
  CancelButtonTitle?: string;
}

export interface FooterContextRequest {
  PageId: ComphubPages | TrendsPages;
  JobPricingBlocked: boolean;
  JobSelected: boolean;
  JobDataSelected: boolean;
  IsPeerQuickPriceType: boolean;
  ShowJobPricedHistorySummary: boolean;
  SmbLimitReached: boolean;
}

export class FooterHelper {
  static jobsFooterContext(nextButtonEnabled: boolean, cancelButtonDisplay: boolean): FooterContext {
    return {
      HideBackButton: true,
      BackButtonEnabled: false,
      HideNextButton: false,
      NextButtonEnabled: nextButtonEnabled,
      PageTitle: 'Jobs',
      PreviousPageTitle: null,
      NextPageTitle: 'Markets',
      DisplayCancelButton: cancelButtonDisplay
    };
  }
  static marketsFooterContext(isPeerQuickPriceType: boolean): FooterContext {
    return {
      HideBackButton: false,
      BackButtonEnabled: true,
      HideNextButton: false,
      NextButtonEnabled: true,
      PageTitle: 'Markets',
      PreviousPageTitle: 'Jobs',
      NextPageTitle: isPeerQuickPriceType ? 'Data' : 'Summary',
      DisplayCancelButton: true
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
      NextPageTitle: 'Summary',
      DisplayCancelButton: true
    };
  }
  static summaryFooterContext(isPeerQuickPriceType: boolean, showJobPricedHistorySummary: boolean, smbLimitReached: boolean): FooterContext {
    return {
      HideBackButton: isPeerQuickPriceType || showJobPricedHistorySummary,
      BackButtonEnabled: !showJobPricedHistorySummary,
      HideNextButton: true,
      NextButtonEnabled: false,
      PageTitle: 'Summary',
      PreviousPageTitle: isPeerQuickPriceType ? 'Data' : 'Markets',
      NextPageTitle: null,
      DisplayCancelButton: smbLimitReached,
      CancelButtonTitle: smbLimitReached ? 'Close' : 'Cancel'
    };
  }

  static trendsLandingFooterContext() {
    return {
      HideBackButton: true,
      BackButtonEnabled: false,
      HideNextButton: false,
      NextButtonEnabled: true,
      PageTitle: 'Landing',
      PreviousPageTitle: null,
      NextPageTitle: 'Jobs',
      DisplayCancelButton: false,
      CancelButtonTitle: null
    };
  }

  static trendsJobsFooterContext() {
    return {
      HideBackButton: false,
      BackButtonEnabled: true,
      HideNextButton: false,
      NextButtonEnabled: true,
      PageTitle: 'Jobs',
      PreviousPageTitle: 'Landing',
      NextPageTitle: 'Scopes',
      DisplayCancelButton: false,
      CancelButtonTitle: null
    };
  }

  static trendsScopesFooterContext() {
    return {
      HideBackButton: false,
      BackButtonEnabled: true,
      HideNextButton: false,
      NextButtonEnabled: true,
      PageTitle: 'Scopes',
      PreviousPageTitle: 'Jobs',
      NextPageTitle: 'Summary',
      DisplayCancelButton: false,
      CancelButtonTitle: null
    };
  }

  static trendsSummaryFooterContext() {
    return {
      HideBackButton: false,
      BackButtonEnabled: true,
      HideNextButton: true,
      NextButtonEnabled: false,
      PageTitle: 'Summary',
      PreviousPageTitle: 'Scopes',
      NextPageTitle: null,
      DisplayCancelButton: false,
      CancelButtonTitle: null
    };
  }

  static getFooterContext(request: FooterContextRequest): FooterContext {
    switch (request.PageId) {
      case ComphubPages.Jobs:
        return this.jobsFooterContext(this.jobsPageNextButtonEnable(request), request.JobSelected);
      case ComphubPages.Markets:
        return this.marketsFooterContext(request.IsPeerQuickPriceType);
      case ComphubPages.Data:
        return this.dataFooterContext(request.JobDataSelected);
      case ComphubPages.Summary:
        return this.summaryFooterContext(request.IsPeerQuickPriceType, request.ShowJobPricedHistorySummary, request.SmbLimitReached);
      case TrendsPages.Landing:
        return this.trendsLandingFooterContext();
      case TrendsPages.Jobs:
        return this.trendsJobsFooterContext();
      case TrendsPages.Scopes:
        return this.trendsScopesFooterContext();
      case TrendsPages.Summary:
        return this.trendsSummaryFooterContext();
      default:
        return null;
    }
  }

  private static jobsPageNextButtonEnable(request: FooterContextRequest): boolean {
    return !request.JobPricingBlocked &&
           ((request.IsPeerQuickPriceType && !!request.JobSelected) ||
            (!request.IsPeerQuickPriceType && request.JobDataSelected));
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
    NextPageTitle: 'Markets',
    DisplayCancelButton: true
  };
}
