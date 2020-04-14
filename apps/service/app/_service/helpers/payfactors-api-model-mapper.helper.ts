import { SupportTeamResponse, UserTicketTypeResponse, UserTicketStateResponse, UserTicketResponse } from 'libs/models/payfactors-api/service/response';

import { TicketType, MultiSelectItemGroup, SupportTeamUser } from '../models';
import { TicketStateHelper } from './ticket-state.helper';
import { UserTicket } from '../models';

export class PayfactorsApiModelMapper {

  /// IN
  static mapTicketTypeResponseToTicketTypes(response: UserTicketTypeResponse[]): TicketType[] {
    return response.map(t => {
      return {
        Active: t.Active,
        SortOrder: t.SortOrder,
        TicketFileTypeId: t.TicketFileTypeId,
        TicketTypeDisplayName: t.TicketSubTypeName ? t.TicketSubTypeName : t.TicketTypeName,
        UserTicketTypeId: t.UserTicketTypeId,
        TicketSubTypeName: t.TicketSubTypeName,
        TicketTypeName: t.TicketTypeName
      };
    });
  }

  static mapTicketStatesToMultiSelectItemGroups(response: UserTicketStateResponse[]): MultiSelectItemGroup[] {
    const openState = TicketStateHelper.createOpenState();
    const ticketStates: MultiSelectItemGroup[] = [ openState ];
    const openStateValues = openState.Items.map(i => i.Value);
    let groupIndex = openState.GroupIndex;
    response.forEach(s => {
      if (openStateValues.indexOf(s.TicketStateName) === -1) {
        groupIndex += 1;
        ticketStates.push({
          GroupIndex: groupIndex,
          Title: s.TicketStateName,
          Items: [ { IsSelected: false, Value: s.TicketStateName } ]
        });
      }
    });
    return ticketStates;
  }

  static mapSupportTeamResponseToSupportTeamUser(response: SupportTeamResponse[]): SupportTeamUser[] {
    return response.map((user) => {
      return {
        UserId: user.UserId,
        FirstName: user.FirstName,
        LastName: user.LastName,
        Title: user.JobTitle,
        PhoneNumber: user.PhoneNumber,
        EmailAddress: user.EmailAddress,
        UserPicture: user.UserPicture
      };
    });
  }

  static mapUserTicketResponseToUserTicket(response: UserTicketResponse): UserTicket {
      return {
        TicketId: response.UserTicketId,
        TicketSummary: response.TicketTitle,
        TicketStatus: response.UserTicketState,
        TicketType: response.UserTicketType,
        TicketDetails: response.UserTicket,
        Attachments: response.UserTicketFiles
      };
  }
}
