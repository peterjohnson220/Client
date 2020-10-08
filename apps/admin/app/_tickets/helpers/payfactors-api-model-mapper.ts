import orderBy from 'lodash/orderBy';
import { groupBy, GroupResult } from '@progress/kendo-data-query';

import {
  UserTicketComment,
  UserTicketCompanyDetailResponse,
  UserTicketResponse,
  UserTicketStateResponse,
  UserTicketTypeResponse,
  UserTicketFile,
  TicketCommentLevel
} from 'libs/models/payfactors-api/service/response';
import { UserResponse } from 'libs/models/payfactors-api/user/response';
import { UserTicketDto } from 'libs/models/service';

import {
  CompanyDetail,
  PfServicesRep,
  UserTicketGridItem,
  UserTicketItem,
  UserTicketState,
  UserTicketType,
  TicketDetail,
  TicketAttachment,
  TicketComment
} from '../models';
import { getFileExtensionType, getFileExtensionCssClass } from 'libs/core/functions';
import { TicketCommentHelper } from 'libs/models/payfactors-api/service/helpers';

export class PayfactorsApiModelMapper {
  static mapUserTicketResponseToUserTicketGridItem(response: UserTicketResponse[]): UserTicketGridItem[] {
    if (response == null || response.length === 0) {
      return [];
    }
    return response.map(ut => {
      return {
        Id: ut.UserTicketId,
        Created: ut.CreateDate,
        CompanyName: ut.CompanyName,
        CompanyId: ut.CompanyId,
        CompanyIdName: this.getTicketCompanyIdName(ut.CompanyId, ut.CompanyName),
        Type: this.getTicketTypeDisplayName(ut.UserTicketType, ut.FileType),
        Status: ut.UserTicketState,
        OpenedUser: ut.OpenedUserFullName,
        ServiceUser: ut.ServicesUserFullName,
        Comments: this.squashComments(ut.UserTicketComments),
        Description: ut.UserTicket,
        TicketCssClass: ut.TicketCssClass,
        OpenedUserFullName: ut.OpenedUserFullName,
        OpenedUserId: ut.OpenedUserId,
        Attachments: this.mapUserTicketFilesToTicketAttachment(ut.UserTicketFiles),
        HasNotes: ut.HasNotes,
        HasNewAttachments: ut.HasNewAttachments,
        UserModifiedDate: ut.UserModifiedDate
      };
    });
  }

  static mapUserTicketResponseToUserTicketItem(response: UserTicketResponse): UserTicketItem {
    let ticketComments = this.mapUserTicketCommentsToTicketComment(response.UserTicketComments);
    const attachmentsComments = this.generateSystemNotesForAttachments(response.UserTicketFiles);
    ticketComments = ticketComments.concat(attachmentsComments);
    ticketComments = orderBy(ticketComments, ['CreateDate'], ['desc']);
    return {
      TicketInfo: {
        TicketId: response.UserTicketId,
        CompanyId: response.CompanyId,
        CompanyName: response.CompanyName,
        ServicesUserId: response.ServicesUserId,
        EditDate: response.EditDate,
        CreateDate: response.CreateDate,
        OpenedBy: response.OpenedUserEmail,
        OpenedByUserId: response.OpenedUserId,
        TicketState: response.UserTicketState,
        LastUpdatedText: response.LastUpdatedText,
        Description: response.UserTicket,
        TicketTitle: response.TicketTitle,
        UserTicketType: {
          UserTicketTypeId: response.UserTicketTypeId,
          TicketFileTypeId: response.TicketFileTypeId,
          SortOrder: response.UserTicketTypeSortOrder,
          TicketTypeDisplayName: this.getTicketTypeDisplayName(response.UserTicketType, response.FileType),
          TicketTypeName: response.UserTicketType,
          TicketSubTypeName: response.FileType,
          TicketCssClass: response.TicketCssClass,
          TicketTypeShortName: response.FileType || response.UserTicketType
        },
        Comments: ticketComments,
        TicketCssClass: response.TicketCssClass
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
      RangeOfOpenedTickets: response.NumberOfDays,
      NotesCount: response.NotesCount
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
    return response.filter(r => r.Active).map(utt => {
      return {
        UserTicketTypeId: utt.UserTicketTypeId,
        TicketFileTypeId: utt.TicketFileTypeId,
        TicketTypeName: utt.TicketTypeName,
        SortOrder: utt.SortOrder,
        TicketSubTypeName: utt.TicketSubTypeName,
        TicketTypeDisplayName: utt.TicketTypeDisplayName,
        TicketCssClass: utt.TicketCssClass,
        TicketTypeShortName: utt.TicketSubTypeName || utt.TicketTypeName
      };
    });
  }

  static mapTicketDetailToUserTicketDto(ticketDetail: TicketDetail): UserTicketDto {
    return {
      UserTicketId: ticketDetail.TicketId,
      UserTicket: ticketDetail.Description,
      ServicesUserId: ticketDetail.ServicesUserId,
      UserTicketState: ticketDetail.TicketState,
      UserTicketType: ticketDetail.UserTicketType.TicketTypeName,
      FileType: ticketDetail.UserTicketType.TicketSubTypeName
    };
  }

  static mapUserTicketFilesToTicketAttachment(userTicketFiles: UserTicketFile[], fileState?: number): TicketAttachment[] {
    return userTicketFiles.map(utf => {
      return {
        AttachmentId: utf.Id,
        DisplayName: utf.DisplayName,
        FileName: utf.FileName,
        ExtensionType: getFileExtensionType(utf.DisplayName),
        ExtensionCssClass: getFileExtensionCssClass(getFileExtensionType(utf.DisplayName.toLowerCase())),
        FileState: fileState
      };
    });
  }

  static mapUserTicketCommentsToTicketComment(userTicketComments: UserTicketComment[]): TicketComment[] {
    const commentsWithReplyCount = TicketCommentHelper.mapUserTicketCommentWithReplyCount(userTicketComments);
    return commentsWithReplyCount.map(utf => {
      return {
        TicketId: utf.UserTicketId,
        CommentId: utf.UserTicketsCommentsId,
        UserEmail: utf.UserEmail,
        FullName: utf.UserFullName,
        Content: utf.Comments,
        CreateDate: utf.CreateDate,
        Level: utf.Level,
        ReplyCount: utf.ReplyCount,
        Replies: this.mapTicketCommentsToReplies(utf.Replies)
      };
    });
  }

  static generateSystemNotesForAttachments(attachments: UserTicketFile[]): TicketComment[] {
    if (!attachments?.length) {
      return [];
    }
    attachments.forEach(f => f.CreateDateWithoutTime = this.createDateWithoutTime(f.CreateDate));
    const notes: TicketComment[] = [];
    const groupedAttachments: UserTicketFile[] | GroupResult[] = groupBy(attachments, [{ field: 'CreateUser' }, { field: 'CreateDateWithoutTime' }]);
    groupedAttachments.forEach(g => {
      g.items.forEach(createDateGroup => {
        const clientName = createDateGroup.items[0].CreateUserFullName;
        const latestCreateDate = createDateGroup.items[createDateGroup.items.length - 1].CreateDate;
        const note: TicketComment = {
          TicketId: createDateGroup.items[0].UserTicketId,
          FullName: 'System Generated',
          Content: `${clientName} uploaded the following files:`,
          Level: TicketCommentLevel.System,
          AttachmentNames: createDateGroup.items.map((f: UserTicketFile) => f.DisplayName),
          CreateDate: latestCreateDate,
          CreateDateWithoutTime: createDateGroup.value
        };
        notes.push(note);
      });
    });
    return notes;
  }

  static createDateWithoutTime(date: Date): Date {
    const dateWithoutTime = new Date(date);
    return new Date(
      dateWithoutTime.getFullYear(),
      dateWithoutTime.getMonth(),
      dateWithoutTime.getDate()
    );
  }

  static mapTicketCommentsToReplies(userTicketComments: UserTicketComment[]): TicketComment[] {
    const replies = userTicketComments.map(utf => {
      return {
        TicketId: utf.UserTicketId,
        CommentId: utf.UserTicketsCommentsId,
        UserEmail: utf.UserEmail,
        FullName: utf.UserFullName,
        Content: utf.Comments,
        CreateDate: utf.CreateDate,
        Level: utf.Level,
        ParentCommentId: utf.ParentTicketCommentId,
        CompanyName: utf.CompanyName
      };
    });
    const orderedReplies = orderBy(replies, ['CreateDate']);
    return orderedReplies;
  }

  private static squashComments(userTicketComments: UserTicketComment[]): string {

    let comment = '';

    userTicketComments.forEach((utc, i) => {
      comment += utc.Comments;
      if (utc.Comments !== '' && (userTicketComments.length - 1) !== i) {
        comment += ' ';
      }
    });

    return comment;
  }

  private static getTicketTypeDisplayName(userTicketType: string, fileType: string): string {
    let displayName = userTicketType;
    if (fileType) {
      displayName = displayName + ' - ' + fileType;
    }

    return displayName;
  }

  private static getTicketCompanyIdName(companyId: number, companyName: string): string {
    return companyId.toString() + ' - ' + companyName;
  }
}
