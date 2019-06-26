import { Action } from '@ngrx/store';

import {UserTicketAttachmentDeleteRequest} from 'libs/models/payfactors-api/service/request';

export const DELETE_ATTACHMENT_MODAL_OPEN = '[Admin Tickets / Ticket ] Open Delete Attachment Modal';
export const DELETE_ATTACHMENT_MODAL_CLOSE = '[Admin Tickets / Ticket] Close Delete Attachment Modal';
export const DELETE_ATTACHMENT = '[Admin Tickets / Ticket ] Delete Attachment';
export const DELETE_ATTACHMENT_SUCCESS = '[Admin Tickets / Ticket ] Delete Attachment Success';
export const DELETE_ATTACHMENT_ERROR = '[Admin Tickets / Ticket ] Delete Attachment Error';

export class DeleteAttachmentModalOpen implements Action {
  readonly type = DELETE_ATTACHMENT_MODAL_OPEN;
}

export class DeleteAttachmentModalClose implements Action {
  readonly type = DELETE_ATTACHMENT_MODAL_CLOSE;
}

export class DeleteAttachment implements Action {
  readonly type = DELETE_ATTACHMENT;

  constructor(public payload: UserTicketAttachmentDeleteRequest) {}
}

export class DeleteAttachmentSuccess implements Action {
  readonly type = DELETE_ATTACHMENT_SUCCESS;
}

export class DeleteAttachmentError implements Action {
  readonly type = DELETE_ATTACHMENT_ERROR;
}

export type Actions
  = DeleteAttachmentModalOpen
  | DeleteAttachmentModalClose
  | DeleteAttachment
  | DeleteAttachmentSuccess
  | DeleteAttachmentError;
