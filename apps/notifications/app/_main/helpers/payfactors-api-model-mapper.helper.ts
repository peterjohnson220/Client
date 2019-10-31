import { DataViewExportResponse } from 'libs/models/payfactors-api/reports/response';

import { DataViewExport } from '../models';

export class PayfactorsApiModelMapper {
  static mapDataViewExportResponsesToDataViewExports(response: DataViewExportResponse[]): DataViewExport[] {
    return response.map(e => {
      return {
        UserDataViewId: e.UserDataViewId,
        EventId: e.EventId,
        ReportName: e.ReportName,
        FileName: e.FileName,
        ExportUrl: e.ExportUrl,
        DownloadDate: e.CreateDate,
      };
    });
  }
}
