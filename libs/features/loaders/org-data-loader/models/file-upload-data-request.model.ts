import { UserContext } from 'libs/models';

export interface FileUploadDataRequestModel {
  loaderConfigurationGroupId: number;
  files: File[];
}

export interface ExcelFileUploadRequest {
  CompanyId: number;
  UserContext: UserContext;
  FormData: {
    loaderConfigurationGroupId: number;
    file: File;
  };
}
