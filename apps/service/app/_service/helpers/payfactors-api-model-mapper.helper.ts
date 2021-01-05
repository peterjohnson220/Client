import {
  SupportTeamResponse, UserTicketTypeResponse, UserTicketStateResponse, UserTicketResponse,
} from 'libs/models/payfactors-api/service/response';
import { PfDataGridFilter } from 'libs/features/grids/pf-data-grid/models';
import { GroupedListItem } from 'libs/models/list';
import { TicketCommentHelper } from 'libs/models/payfactors-api/service/helpers';

import { TicketType, SupportTeamUser, NoteAccessLevel, TicketListMode } from '../models';
import { TicketStateHelper } from './ticket-state.helper';
import { UserTicket } from '../models';

export class PayfactorsApiModelMapper {

  /// IN
  static mapTicketTypeResponseToTicketTypes(response: UserTicketTypeResponse[]): TicketType[] {
    const allTicketType: TicketType = {
      Active: false,
      SortOrder: 0,
      TicketFileTypeId: null,
      TicketTypeDisplayName: 'All',
      UserTicketTypeId: null,
      TicketSubTypeName: null,
      TicketTypeName: 'All'
    };
    const ticketTypes: TicketType[] = [ allTicketType ];
    response.forEach(t => {
      ticketTypes.push({
        Active: t.Active,
        SortOrder: t.SortOrder,
        TicketFileTypeId: t.TicketFileTypeId,
        TicketTypeDisplayName: t.TicketSubTypeName ? t.TicketSubTypeName : t.TicketTypeName,
        UserTicketTypeId: t.UserTicketTypeId,
        TicketSubTypeName: t.TicketSubTypeName,
        TicketTypeName: t.TicketTypeName
      });
    });
    return ticketTypes;
  }

  static mapTicketStatesToGroupedListItems(response: UserTicketStateResponse[]): GroupedListItem[] {
    const openState = TicketStateHelper.createOpenState();
    const ticketStates: GroupedListItem[] = [ openState ];
    const openStateValues = openState.Children.map(i => i.Value);
    response.forEach(s => {
      if (openStateValues.indexOf(s.TicketStateName) === -1) {
        ticketStates.push({
          Name: s.TicketStateName,
          Value: s.TicketStateName
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
        UserPicture: user.UserPicture,
        Team: user.Team
      };
    });
  }

  static mapUserTicketResponseToUserTicket(userId: number, response: UserTicketResponse): UserTicket {
      return {
        TicketId: response.UserTicketId,
        TicketSummary: response.TicketTitle,
        TicketStatus: response.UserTicketState,
        TicketType:  !!response.FileType ? response.FileType : response.UserTicketType,
        TicketDetails: response.UserTicket,
        Attachments: response.UserTicketFiles,
        Notes: TicketCommentHelper.mapUserTicketCommentsToComments(response.UserTicketComments),
        NoteAccessLevel: response.UserId === userId ? NoteAccessLevel.Owner : NoteAccessLevel.ReadOnly,
        IsPrivate: response.IsPrivate
      };
  }

  // OUT
  static buildInboundFiltersByTicketListMode(listType: TicketListMode, userId: number): PfDataGridFilter[] {
    if (listType === TicketListMode.AllCompanyTickets) {
      return [{
        SourceName: 'Is_Private',
        Operator: 'equalsornull',
        Value: '0',
        ExcludeFromFilterSave: true
      }];
    }
    return [{
      SourceName: 'User_ID',
      Operator: '=',
      Value: userId ? userId.toString() : null,
      ExcludeFromFilterSave: true
    }];
  }
}
