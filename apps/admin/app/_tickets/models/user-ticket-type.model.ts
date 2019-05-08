export interface UserTicketType {
    UserTicketTypeId: number;
    SortOrder: number;
    TicketTypeName: string;
    TicketSubTypeName: string;
    TicketTypeDisplayName: string;
    TicketCssClass: string;
}

export function generateMockUserTicketType(): UserTicketType {
    return {
      UserTicketTypeId: 1,
      TicketTypeName: 'Job Pricing',
      SortOrder: 1,
      TicketSubTypeName: 'MockTicketSubTypeName',
      TicketTypeDisplayName: 'MockTicketTypeDisplayName',
      TicketCssClass: 'MockTicketCssClass'
    };
}
