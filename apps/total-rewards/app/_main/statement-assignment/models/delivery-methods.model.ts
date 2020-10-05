import { ListAreaColumn } from 'libs/models/common/list-area';

export enum DeliveryMethod {
  Electronic = 'Electronic',
  PDFExport = 'PDFExport'
}

export class ElectronicDeliveryHelper {
  static setColumnsVisible(columns: ListAreaColumn[], featureFlagEnabled: boolean): ListAreaColumn[] {
    const columnsToHide = ['TotalRewardsDeliveryMethod', 'TotalRewardsDeliveryStatus', 'EmailAddress'];
    if (featureFlagEnabled) {
      return columns;
    }
    return columns.map(column => {
      if (columnsToHide.indexOf(column.ColumnDatabaseName) > -1) {
        column.Visible = false;
      }
      return column;
    });
  }
}
