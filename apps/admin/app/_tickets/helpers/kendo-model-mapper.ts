import { FileInfo, FileState } from '@progress/kendo-angular-upload';
import { UploadTicketAttachment } from '../models';


export class KendoModelMapper {
    static mapFileInfoToUploadTicketAttachment(file: FileInfo): UploadTicketAttachment {
        return {
            extension: file.extension,
            name: file.name,
            uid: file.uid,
            httpSubscription: file.httpSubscription,
            rawFile: file.rawFile,
            size: file.size,
            state: file.validationErrors && file.validationErrors.length > 0 ? FileState.Failed : file.state,
            uploadProgress: 0,
            validationErrors: file.validationErrors
        };
    }
}
