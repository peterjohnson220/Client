export interface StatementAdditionalPageSettings {
  PagePlacement: StatementAdditionalPagePlacementEnum;
  ShowStatementHeader: boolean;
}

export enum StatementAdditionalPagePlacementEnum {
  None = 0,
  BeforeStatement = 1,
  AfterStatement = 2
}
