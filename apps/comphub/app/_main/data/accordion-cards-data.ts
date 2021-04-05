export enum ComphubPages {
  Jobs = 'comphubJobsPage',
  Markets = 'comphubMarketsPage',
  Data = 'comphubDataPage',
  Summary = 'comphubSummaryPage',
  SummaryHistory = 'comphubSummaryHistoryPage'
}

export enum TrendsPages {
  Landing = 'trendsLandingPage',
  Jobs = 'trendsJobsPage',
  Scopes = 'trendsScopePage',
  Summary = 'trendsSummaryPage'
}



export enum AllPages {
  ComphubJobs = ComphubPages.Jobs,
  ComphubMarkets = ComphubPages.Markets,
  ComphubData = ComphubPages.Data,
  ComphubSummary = ComphubPages.Summary,
  ComphubSummaryHistory = ComphubPages.SummaryHistory,
  TrendsLanding = TrendsPages.Landing,
  TrendsJobs = TrendsPages.Jobs,
  TrendsScopes = TrendsPages.Scopes,
  TrendsSummary = TrendsPages.Summary
}

export interface AccordionCard {
  Id: ComphubPages | TrendsPages;
  Title: string;
  IconClass: string;
  Subtitle: string;
}

export class ComphubAccordionCards {
  static jobs: AccordionCard = {
    Id: ComphubPages.Jobs,
    Title: 'Jobs',
    IconClass: 'user-circle',
    Subtitle: ''
  };
  static markets: AccordionCard = {
    Id: ComphubPages.Markets,
    Title: 'Markets',
    IconClass: 'map-marker-alt',
    Subtitle: 'National'
  };
  static data: AccordionCard = {
    Id: ComphubPages.Data,
    Title: 'Data',
    IconClass: 'database',
    Subtitle: ''
  };
  static summary: AccordionCard = {
    Id: ComphubPages.Summary,
    Title: 'Summary',
    IconClass: 'file-alt',
    Subtitle: ''
  };

  static get defaultAccordionCards(): AccordionCard[] {
    return [
      this.jobs,
      this.markets,
      this.summary
    ];
  }

  static get peerAccordionCards(): AccordionCard[] {
    return [
      this.jobs,
      this.markets,
      this.data,
      this.summary
    ];
  }
}

export class TrendsAccordionCards {
  static landing: AccordionCard = {
    Id: TrendsPages.Landing,
    Title: 'Landing',
    IconClass: 'file-alt',
    Subtitle: ''
  };
  static jobs: AccordionCard = {
    Id: TrendsPages.Jobs,
    Title: 'Jobs',
    IconClass: 'file-alt',
    Subtitle: ''
  };
  static scopes: AccordionCard = {
    Id: TrendsPages.Scopes,
    Title: 'Scopes',
    IconClass: 'file-alt',
    Subtitle: ''
  };
  static summary: AccordionCard = {
    Id: TrendsPages.Summary,
    Title: 'Summary',
    IconClass: 'file-alt',
    Subtitle: ''
  };

  static get trendAccordionCards(): AccordionCard[] {
    return [
      this.landing,
      this.jobs,
      this.scopes,
      this.summary
    ];
  }
}
