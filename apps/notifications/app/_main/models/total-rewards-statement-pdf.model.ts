export interface TotalRewardsStatementPdf {
  FileDisplayName: string;
  FileName: string;
  CreatedDateTime: Date;
  DownloadPath: string;
}

export function generateTotalRewardsStatementPdf(): TotalRewardsStatementPdf {
  return {
    FileDisplayName: 'StatementName',
    FileName: 'FileName',
    CreatedDateTime: new Date('6/11/2020'),
    DownloadPath: 'Download/Path',
  };
}
