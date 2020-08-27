import orderBy from 'lodash/orderBy';

import { TicketType } from '../models';

export const ticketTypesOrdering = [
  'All',
  'Organization Data',
  'Survey Data',
  'Training Request',
  'Job Pricing',
  'Question',
  'Data Insights',
  'Job Description',
  'PEER Exchange',
  'Survey Participation',
  'Product Issue',
  'Other'
];

export class TicketTypeHelper {
  static orderTicketTypes(ticketTypes: TicketType[]): TicketType[] {
    const unorderedTicketTypes: TicketType[] = ticketTypes.filter(t => ticketTypesOrdering.indexOf(t.TicketTypeDisplayName) === -1);
    const hasOrderTicketTypes: TicketType[] = ticketTypes.filter(t => ticketTypesOrdering.indexOf(t.TicketTypeDisplayName) > -1);
    let orderedTicketTypes = orderBy(hasOrderTicketTypes, [
      (ticketType: TicketType) => ticketTypesOrdering.indexOf(ticketType.TicketTypeDisplayName)
    ]);
    if (unorderedTicketTypes?.length) {
      orderedTicketTypes = orderedTicketTypes.concat(unorderedTicketTypes);
    }
    return orderedTicketTypes;
  }
}
