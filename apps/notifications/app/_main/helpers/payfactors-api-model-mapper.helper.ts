import { DataViewExportListItem } from '../models';

export class PayfactorsApiModelMapper {
  static mapDataViewExportResponsesToDataViewExports(response: any[]): DataViewExportListItem[] {
    return response.map(e => {
      return {
        UserDataViewId: e.UserDataViewId,
        EventId: e.EventId,
        FileName: e.FileName,
        DownloadDate: e.CreateDate,
      };
    });
  }
}
