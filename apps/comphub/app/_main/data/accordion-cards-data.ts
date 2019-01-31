export enum ComphubPages {
  Jobs = 'comphubJobsPage',
  Markets = 'comphubMarketsPage',
  Data = 'comphubDataPage',
  Summary = 'comphubSummaryPage'
}

export interface AccordionCard {
  Id: string;
  Title: string;
  IconClass: string;
}

export const AccordionCards: AccordionCard[] = [
  {
    Id: ComphubPages.Jobs,
    Title: 'Jobs',
    IconClass: 'fa-user-circle'
  },
  {
    Id: ComphubPages.Markets,
    Title: 'Markets',
    IconClass: 'fa-map-marker-alt'
  },
  {
    Id: ComphubPages.Data,
    Title: 'Data',
    IconClass: 'fa-database'
  },
  {
    Id: ComphubPages.Summary,
    Title: 'Summary',
    IconClass: 'fa-file-alt'
  },
];
