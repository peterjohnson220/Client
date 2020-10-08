import { ListAreaColumn } from 'libs/models';

export class StatementAssignmentConfig {
  static statementAssignmentMax = 100000;
}

export class AssignedEmployeesGridHelper {

  static filterGridColumns(columns: ListAreaColumn[], featureFlagEnabled: boolean): ListAreaColumn[] {
    const columnsToHideWhenFeatureFlagDisabled = ['TotalRewardsDeliveryMethod', 'TotalRewardsDeliveryStatus', 'EmailAddress'];
    let gridColumns: ListAreaColumn[] = columns.filter(lac =>
      lac.ColumnDatabaseName !== 'CompanyEmployeeId' && lac.ColumnDatabaseName !== 'AssignedStatementId');
    if (!featureFlagEnabled) {
      gridColumns = gridColumns.filter(c => columnsToHideWhenFeatureFlagDisabled.indexOf(c.ColumnDatabaseName) === -1);
    }
    return gridColumns;
  }

}
