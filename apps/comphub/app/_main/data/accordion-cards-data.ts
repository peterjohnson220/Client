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

export const AccordionCards: AccordionCard[] = [
  {
    Id: ComphubPages.Jobs,
    Title: 'Jobs',
    IconClass: 'user-circle',
    Subtitle: ''
  },
  {
    Id: ComphubPages.Markets,
    Title: 'Markets',
    IconClass: 'map-marker-alt',
    Subtitle: 'National'
  },
  {
    Id: ComphubPages.Data,
    Title: 'Data',
    IconClass: 'database',
    Subtitle: ''
  },
  {
    Id: ComphubPages.Summary,
    Title: 'Summary',
    IconClass: 'file-alt',
    Subtitle: ''
  },
];
