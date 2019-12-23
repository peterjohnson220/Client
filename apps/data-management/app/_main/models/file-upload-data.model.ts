import {FileUploadDataRequestModel} from 'libs/features/org-data-loader/models';
import {UserContext} from 'libs/models/security';

export interface FileUploadDataModel {
  companyId: number;
  userContext: UserContext;
  fileUpload: FileUploadDataRequestModel;
}
