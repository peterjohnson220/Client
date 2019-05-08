import {
  UserTicketComment,
  UserTicketCompanyDetailResponse,
  UserTicketResponse,
  UserTicketStateResponse,
  UserTicketTypeResponse
} from 'libs/models/payfactors-api/service/response';
import { UserResponse } from 'libs/models/payfactors-api/user/response';

import {CompanyDetail, PfServicesRep, UserTicketGridItem, UserTicketItem, UserTicketState, UserTicketType} from '../models';


export class PayfactorsApiModelMapper {
  static mapUserTicketResponseToUserTicketGridItem(response: UserTicketResponse[]): UserTicketGridItem[] {
    return response.map( ut => {
      return {
        Id: ut.UserTicketId,
        Created: ut.CreateDate,
        CompanyName: ut.CompanyName,
        CompanyId: ut.CompanyId,
        Type: this.getTicketTypeDisplayName(ut.UserTicketType, ut.FileType),
        Status: ut.UserTicketState,
        OpenedUser: ut.OpenedUserEmail,
        ServiceUser: ut.ServicesUserEmail,
        Comments: this.squashComments(ut.UserTicketComments),
        Description: ut.UserTicket,
        TicketCssClass: ut.TicketCssClass
      };
    });
  }

  static mapUserTicketResponseToUserTicketItem(response: UserTicketResponse): UserTicketItem {
    return {
      Description: response.UserTicket,
      TicketInfo: {
        TicketId: response.UserTicketId,
        CompanyId: response.CompanyId,
        CompanyName: response.CompanyName,
        ServicesUserId: response.ServicesUserId,
        EditDate: response.EditDate,
        CreateDate: response.CreateDate,
        OpenedBy: response.OpenedUserEmail,
        TicketState: response.UserTicketState,
        LastUpdatedText: response.LastUpdatedText,
        UserTicketType: {
          UserTicketTypeId: response.UserTicketTypeId,
          SortOrder: response.UserTicketTypeSortOrder,
          TicketTypeDisplayName: this.getTicketTypeDisplayName(response.UserTicketType, response.FileType),
          TicketTypeName: response.UserTicketType,
          TicketSubTypeName: response.FileType,
          TicketCssClass: response.TicketCssClass,
        }
      },
      CompanyInfo: null
    };
  }

  static mapUserTicketCompanyDetailResponseToCompanyDetail(response: UserTicketCompanyDetailResponse): CompanyDetail {
    return {
      Id: response.CompanyId,
      Name: response.CompanyName,
      ClientType: response.ClientType,
      OpenTickets: response.NumberOfOpenTickets,
      RecentTickets: response.NumberOfRecentTickets,
      RecentTicketIds: response.RecentTickets,
      RangeOfOpenedTickets: response.NumberOfDays
    };
  }

  static mapUserResponseToPfServicesRep(response: UserResponse[]): PfServicesRep[] {
    return response.map(ur => {
      return {
        PfServicesRepId: ur.UserId,
        Name: `${ur.FirstName} ${ur.LastName}`
      };
    });
  }

  static mapUserTicketStatesResposnseToUserTicketState(response: UserTicketStateResponse[]): UserTicketState[] {
    return response.map(us => {
      return {
        UserTicketStateId: us.UserTicketStateId,
        UserTicketState: us.TicketStateName
      };
    });
  }

  static mapUserTicketTypeResponseToTicketType(response: UserTicketTypeResponse[]): UserTicketType[] {
    return response.map( utt => {
      return {
        UserTicketTypeId: utt.UserTicketTypeId,
        TicketTypeName: utt.TicketTypeName,
        SortOrder: utt.SortOrder,
        TicketSubTypeName: utt.TicketSubTypeName,
        TicketTypeDisplayName: utt.TicketTypeDisplayName,
        TicketCssClass: utt.TicketCssClass
      };
    });
  }

  private static squashComments( userTicketComments: UserTicketComment[]): string {

    let comment = '';

    userTicketComments.forEach((utc, i) => {
      comment += utc.Comments;
      if ( utc.Comments !== '' && (userTicketComments.length - 1) !== i ) {
        comment += ' ';
      }
    });

    return comment;
  }

  private static getTicketTypeDisplayName( userTicketType: string, fileType: string): string {
    let displayName = userTicketType;
    if (fileType) {
      displayName = displayName + ' - ' + fileType;
    }

    return displayName;
  }
}
