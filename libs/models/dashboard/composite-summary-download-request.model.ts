export enum FileType {
  InvalidRecordsFile,
  ExportedSourceFile
}

export interface CompositeSummaryDownloadRequest {
  Id: string;
  FileType: FileType;
}
