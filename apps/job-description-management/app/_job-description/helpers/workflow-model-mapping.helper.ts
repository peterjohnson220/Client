import { FileInfo } from '@progress/kendo-angular-upload';
import { JobDescriptionWorkflowAttachment, KendoUploadStatus } from 'libs/models';
import { MappingHelper } from 'libs/core';

export function mapFileInfoToWorkflowAddAttachment(file: FileInfo, cloudFileName: string): JobDescriptionWorkflowAttachment {
  return {
    Id: file.uid,
    Name: file.name,
    Size: file.size,
    FileType: MappingHelper.mapFileExtensionToFileType(file.extension),
    CloudFileName: cloudFileName,
    Status: KendoUploadStatus.NotStarted
  };
}
