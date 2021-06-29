export enum ComphubPages {
  // quick-price
  Jobs = 'comphubJobsPage',
  Markets = 'comphubMarketsPage',
  Data = 'comphubDataPage',
  Summary = 'comphubSummaryPage',
  SummaryHistory = 'comphubSummaryHistoryPage',

  // trends
  TrendsLanding = 'trendsLandingPage',
  TrendsJobs = 'trendsJobsPage',
  TrendsScopes = 'trendsScopePage',
  TrendsSummary = 'trendsSummaryPage'
}

export interface AccordionCard {
  Id: ComphubPages;
  Title: string;
  IconClass: string;
  Subtitle: string;
}

export class QuickPriceAccordionCards {
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
    Id: ComphubPages.TrendsLanding,
    Title: 'Landing',
    IconClass: 'file-alt',
    Subtitle: ''
  };
  static jobs: AccordionCard = {
    Id: ComphubPages.TrendsJobs,
    Title: 'Jobs',
    IconClass: 'file-alt',
    Subtitle: ''
  };
  static scopes: AccordionCard = {
    Id: ComphubPages.TrendsScopes,
    Title: 'Scopes',
    IconClass: 'file-alt',
    Subtitle: ''
  };
  static summary: AccordionCard = {
    Id: ComphubPages.TrendsSummary,
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
