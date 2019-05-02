import {
  UserTicketComment,
  UserTicketCompanyDetailResponse,
  UserTicketResponse,
  UserTicketStateResponse
} from 'libs/models/payfactors-api/service/response';
import { UserResponse } from 'libs/models/payfactors-api/user/response';

import {CompanyDetail, PfServicesRep, UserTicketGridItem, UserTicketItem, UserTicketState} from '../models';


export class PayfactorsApiModelMapper {
  static mapUserTicketResponseToUserTicketGridItem(response: UserTicketResponse[]): UserTicketGridItem[] {
    return response.map( ut => {
      return {
        Id: ut.UserTicketId,
        Created: ut.CreateDate,
        CompanyName: ut.CompanyName,
        CompanyId: ut.CompanyId,
        Type: ut.UserTicketType,
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
        TicketType: response.UserTicketType,
        TicketCssClass: response.TicketCssClass,
        TicketState: response.UserTicketState,
        LastUpdatedText: response.LastUpdatedText
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
}
