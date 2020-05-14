import {
  SupportTeamResponse, UserTicketTypeResponse, UserTicketStateResponse, UserTicketResponse, UserTicketComment
} from 'libs/models/payfactors-api/service/response';
import { MultiSelectItemGroup } from 'libs/ui/common';
import { PfDataGridFilter } from 'libs/features/pf-data-grid/models';

import { TicketType, SupportTeamUser, TicketNote, NoteAccessLevel, SupportTeam, TicketListMode } from '../models';
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
          Items: [ { IsSelected: false, Name: s.TicketStateName, Value: s.TicketStateName } ]
        });
      }
    });
    return ticketStates;
  }

  static mapSupportTeamResponseToSupportTeamUser(response: SupportTeamResponse[]): SupportTeamUser[] {
    return response.map((user) => {
      const team: SupportTeam = this.findTeamByJobTitle(user.JobTitle);
      return {
        UserId: user.UserId,
        FirstName: user.FirstName,
        LastName: user.LastName,
        Title: user.JobTitle,
        PhoneNumber: user.PhoneNumber,
        EmailAddress: user.EmailAddress,
        UserPicture: user.UserPicture,
        Team: team
      };
    });
  }

  static findTeamByJobTitle(jobTitle: string): SupportTeam {
    if (jobTitle.includes('Client Services')) {
      return SupportTeam.ClientServices;
    } else if (jobTitle.includes('Customer Success')) {
      return SupportTeam.ClientSuccess;
    }
    return null;
  }

  static mapUserTicketResponseToUserTicket(userId: number, response: UserTicketResponse): UserTicket {
      return {
        TicketId: response.UserTicketId,
        TicketSummary: response.TicketTitle,
        TicketStatus: response.UserTicketState,
        TicketType:  !!response.FileType ? response.FileType : response.UserTicketType,
        TicketDetails: response.UserTicket,
        Attachments: response.UserTicketFiles,
        Notes: this.mapUserTicketCommentsToTicketNotes(response.UserTicketComments),
        NoteAccessLevel: response.UserId === userId ? NoteAccessLevel.Owner : NoteAccessLevel.ReadOnly
      };
  }

  static mapUserTicketCommentsToTicketNotes(comments: UserTicketComment[]): TicketNote[] {
    if (!comments || comments.length === 0) {
      return [];
    }
    return comments.map((comment) => {
      return {
        Content: comment.Comments,
        PostedDate: comment.CreateDate,
        UserName: comment.UserFullName
      };
    });
  }

  // OUT
  static buildInboundFiltersByTicketListMode(listType: TicketListMode, userId: number): PfDataGridFilter[] {
    if (listType === TicketListMode.AllCompanyTickets) {
      return [{
        SourceName: 'Is_Private',
        Operator: '=',
        Value: '0'
      }];
    }
    return [{
      SourceName: 'User_ID',
      Operator: '=',
      Value: userId ? userId.toString() : null
    }];
  }
}
