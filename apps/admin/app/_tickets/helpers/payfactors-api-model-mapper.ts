
import {UserTicketGridItem, UserTicketItem} from '../models';
import {UserTicketComment, UserTicketResponse} from 'libs/models/payfactors-api/service/response';

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
        CompanyName: response.CompanyName,
        EditDate: response.EditDate,
        CreateDate: response.CreateDate,
        OpenedBy: response.OpenedUserEmail,
        TicketType: response.UserTicketType,
        TicketCssClass: response.TicketCssClass,
        TicketState: response.UserTicketState
      }
    };
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
