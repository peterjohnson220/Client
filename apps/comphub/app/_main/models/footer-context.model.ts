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
}

export interface FooterContextRequest {
  PageId: ComphubPages;
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
      DisplayCancelButton: showJobPricedHistorySummary && smbLimitReached
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
