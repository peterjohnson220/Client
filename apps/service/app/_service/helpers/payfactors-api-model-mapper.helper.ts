import { TicketType } from '../models';
import { UserTicketTypeResponse } from 'libs/models/payfactors-api/service/response';

export class PayfactorsApiModelMapper {

  /// IN
  static mapTicketTypeResponseToTicketTypes(response: UserTicketTypeResponse[]): TicketType[] {
    return response.map(t => {
      return {
        Active: t.Active,
        SortOrder: t.SortOrder,
        TicketFileTypeId: t.TicketFileTypeId,
        TicketTypeDisplayName: t.TicketTypeDisplayName,
        UserTicketTypeId: t.UserTicketTypeId,
        TicketSubTypeName: t.TicketSubTypeName,
        TicketTypeName: t.TicketTypeName
      };
    });
  }
}
