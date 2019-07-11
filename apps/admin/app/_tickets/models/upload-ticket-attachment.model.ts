import { FileInfo } from '@progress/kendo-angular-upload';

export interface UploadTicketAttachment extends FileInfo {
    uploadProgress: number;
    attachmentId?: number;
}
