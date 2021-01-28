import {FileUploadHeaderRequestModel} from './file-upload-header-request.model';
export interface ColumnNameRequestModel {
  columnNamesFile: FileUploadHeaderRequestModel;
  columnNames: string[];
  entity: string;
}
