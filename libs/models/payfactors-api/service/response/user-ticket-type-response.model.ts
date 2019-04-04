export interface UserTicketTypeResponse {
  UserTicketTypeId: number;
  TicketTypeName: string;
  TicketCssClass: string;
  SortOrder: number;
  Active: boolean;
  CreateDate: Date;
  CreateUser: number;
  EditDate: Date;
  EditUser: number;
}

export function generateMockUserTicketTypeResponse(): UserTicketTypeResponse {
  return {
    UserTicketTypeId: 1,
    TicketTypeName: 'Job Pricing',
    TicketCssClass: 'jobPricingColor',
    SortOrder: 1,
    Active: true,
    CreateDate: new Date(2019, 3, 28),
    CreateUser: -1,
    EditDate: new Date(2019, 3, 28),
    EditUser: -1,
  };
}
