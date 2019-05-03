export interface UserTicketTypeResponse {
  UserTicketTypeId: number;
  TicketTypeName: string;
  TicketCssClass: string;
  SortOrder: number;
  Active: boolean;
  TicketSubTypeName: string;
  TicketTypeDisplayName: string;
}

export function generateMockUserTicketTypeResponse(): UserTicketTypeResponse {
  return {
    UserTicketTypeId: 1,
    TicketTypeName: 'Job Pricing',
    TicketCssClass: 'jobPricingColor',
    SortOrder: 1,
    Active: true,
    TicketSubTypeName: 'MockTicketSubTypeName',
    TicketTypeDisplayName: 'MockTicketTypeDisplayName'
  };
}
