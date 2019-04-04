export interface UserTicketTabItem {
  UserTicketId: number;
  Title: string;
}

export function generateMockUserTicketTabItem(ticketId: number = 1): UserTicketTabItem {
  return  {
    UserTicketId: ticketId,
    Title: 'MockTitle_' + ticketId
  };
}

export function generateMockUserTicketTabItems(): UserTicketTabItem[] {
  return [
    generateMockUserTicketTabItem(1),
    generateMockUserTicketTabItem(2),
    generateMockUserTicketTabItem(3)
  ];
}
