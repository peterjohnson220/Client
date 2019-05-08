import {
  UserTicketComment,
  UserTicketCompanyDetailResponse,
  UserTicketResponse,
  UserTicketStateResponse,
  UserTicketTypeResponse,
  UserTicketFile
} from 'libs/models/payfactors-api/service/response';
import { UserResponse } from 'libs/models/payfactors-api/user/response';

import {
  CompanyDetail,
  PfServicesRep,
  UserTicketGridItem,
  UserTicketItem,
  UserTicketState,
  UserTicketType,
  TicketAttachment
} from '../models';


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
        TicketTypeDisplayName: this.getTicketTypeDisplayName(response.UserTicketType, response.FileType),
        TicketType: response.UserTicketType,
        TicketSubType: response.FileType,
        TicketCssClass: response.TicketCssClass,
        TicketState: response.UserTicketState,
        LastUpdatedText: response.LastUpdatedText
      },
      CompanyInfo: null,
      Attachments: this.mapUserTicketFilesToTicketAttachment(response.UserTicketFiles)
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
        TicketTypeDisplayName: utt.TicketTypeDisplayName
      };
    });
  }

  static mapUserTicketFilesToTicketAttachment( userTicketFiles: UserTicketFile[]): TicketAttachment[] {
    return userTicketFiles.map( utf => {
      return {
        AttachmentId: utf.UserTicketsFileId,
        DisplayName: utf.DisplayName,
        FileName: utf.FileName,
        ExtensionType: this.getFileExtensionType(utf.DisplayName),
        ExtensionCssClass: this.getExtensionCssClass(this.getFileExtensionType(utf.DisplayName.toLowerCase()))
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

  private static getFileExtensionType(file: string): string {
    const re = /(?:\.([^.]+))?$/;
    return re.exec(file)[1];
  }

  private static getExtensionCssClass(extension: string): string {
    switch (extension) {
      case 'xlsx':
      case 'xls':
      case 'xlsb':
      case 'xlsm':
      case 'xltx':
      case 'xltm':
      case 'xla':
        return 'fa-file-excel';
      case 'docx':
      case 'docm':
      case 'dotx':
      case 'dotm':
      case 'docb':
      case 'doc':
        return 'fa-file-word';
      case 'ppt':
      case 'pptx':
        return 'fa-file-word';
      case 'pdf':
        return 'fa-file-pdf';
      case 'jpg':
      case 'jpeg':
      case 'png':
        return 'fa-file-image';
      case 'zip':
      case 'zipx':
      case '7z':
        return 'fa-file-archive';
      case 'msg':
        return 'fa-envelope';
      case 'csv':
      case 'txt':
      case 'xml':
      case 'exe':
      case 'mht':
      case 'mdb':
      case 'partial':
      default:
        return 'fa-file-alt';
    }
  }
}
