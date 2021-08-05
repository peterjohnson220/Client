import { ComphubPages } from '../data';

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
  DisplaySaveButton: boolean;
  SaveButtonEnabled: boolean;
}

export interface FooterContextRequest {
  PageId: ComphubPages;
  JobPricingBlocked: boolean;
  JobSelected: boolean;
  JobDataSelected: boolean;
  IsPeerComphubType: boolean;
  ShowJobPricedHistorySummary: boolean;
  SmbLimitReached: boolean;
  SelectedTrendId: number;
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
      DisplayCancelButton: cancelButtonDisplay,
      DisplaySaveButton: false,
      SaveButtonEnabled: false
    };
  }
  static marketsFooterContext(isPeerComphubType: boolean): FooterContext {
    return {
      HideBackButton: false,
      BackButtonEnabled: true,
      HideNextButton: false,
      NextButtonEnabled: true,
      PageTitle: 'Markets',
      PreviousPageTitle: 'Jobs',
      NextPageTitle: isPeerComphubType ? 'Data' : 'Summary',
      DisplayCancelButton: true,
      DisplaySaveButton: false,
      SaveButtonEnabled: false
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
      DisplayCancelButton: true,
      DisplaySaveButton: false,
      SaveButtonEnabled: false
    };
  }
  static summaryFooterContext(isPeerComphubType: boolean, showJobPricedHistorySummary: boolean, smbLimitReached: boolean): FooterContext {
    return {
      HideBackButton: isPeerComphubType || showJobPricedHistorySummary,
      BackButtonEnabled: !showJobPricedHistorySummary,
      HideNextButton: true,
      NextButtonEnabled: false,
      PageTitle: 'Summary',
      PreviousPageTitle: isPeerComphubType ? 'Data' : 'Markets',
      NextPageTitle: null,
      DisplayCancelButton: smbLimitReached,
      CancelButtonTitle: smbLimitReached ? 'Close' : 'Cancel',
      DisplaySaveButton: false,
      SaveButtonEnabled: false
    };
  }

  static trendsLandingFooterContext(trendIdIsSelected: boolean) {
    return {
      HideBackButton: true,
      BackButtonEnabled: false,
      HideNextButton: trendIdIsSelected,
      NextButtonEnabled: true,
      PageTitle: 'Landing',
      PreviousPageTitle: null,
      NextPageTitle: 'Jobs',
      DisplayCancelButton: false,
      CancelButtonTitle: null,
      DisplaySaveButton: false,
      SaveButtonEnabled: false
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
      CancelButtonTitle: null,
      DisplaySaveButton: false,
      SaveButtonEnabled: false
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
      CancelButtonTitle: null,
      DisplaySaveButton: false,
      SaveButtonEnabled: false
    };
  }

  static trendsSummaryFooterContext(trendIdIsSelected: boolean) {
    return {
      HideBackButton: trendIdIsSelected,
      BackButtonEnabled: true,
      HideNextButton: true,
      NextButtonEnabled: false,
      PageTitle: 'Summary',
      PreviousPageTitle: 'Scopes',
      NextPageTitle: null,
      DisplayCancelButton: false,
      CancelButtonTitle: null,
      DisplaySaveButton: !trendIdIsSelected,
      SaveButtonEnabled: true
    };
  }

  static getFooterContext(request: FooterContextRequest): FooterContext {
    switch (request.PageId) {
      case ComphubPages.Jobs:
        return this.jobsFooterContext(this.jobsPageNextButtonEnable(request), request.JobSelected);
      case ComphubPages.Markets:
        return this.marketsFooterContext(request.IsPeerComphubType);
      case ComphubPages.Data:
        return this.dataFooterContext(request.JobDataSelected);
      case ComphubPages.Summary:
        return this.summaryFooterContext(request.IsPeerComphubType, request.ShowJobPricedHistorySummary, request.SmbLimitReached);
      case ComphubPages.TrendsLanding:
        return this.trendsLandingFooterContext(!!request.SelectedTrendId);
      case ComphubPages.TrendsJobs:
        return this.trendsJobsFooterContext();
      case ComphubPages.TrendsScopes:
        return this.trendsScopesFooterContext();
      case ComphubPages.TrendsSummary:
        return this.trendsSummaryFooterContext(!!request.SelectedTrendId);
      default:
        return null;
    }
  }

  private static jobsPageNextButtonEnable(request: FooterContextRequest): boolean {
    return !request.JobPricingBlocked &&
           ((request.IsPeerComphubType && !!request.JobSelected) ||
            (!request.IsPeerComphubType && request.JobDataSelected));
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
    DisplayCancelButton: true,
    DisplaySaveButton: false,
    SaveButtonEnabled: false
  };
}
