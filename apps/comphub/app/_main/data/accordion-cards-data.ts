export enum ComphubPages {
  Jobs = 'comphubJobsPage',
  Markets = 'comphubMarketsPage',
  Data = 'comphubDataPage',
  Summary = 'comphubSummaryPage'
}

export interface AccordionCard {
  Id: ComphubPages;
  Title: string;
  IconClass: string;
  Subtitle: string;
}

export class AccordionCards {
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
