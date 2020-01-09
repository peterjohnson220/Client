import {FileUploadHeaderRequestModel} from 'libs/features/org-data-loader/models';
export interface ColumnNameRequestModel {
  columnNamesFile: FileUploadHeaderRequestModel;
  columnNames: string[];
  entity: string;
}
