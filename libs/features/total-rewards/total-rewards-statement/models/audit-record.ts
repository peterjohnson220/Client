export interface AuditRecord {
  $type: string;
  EditedById: number;
  EditedBy: string;
  EditedDateTime: Date;
  CreatedById: number;
  CreatedBy: string;
  CreatedDateTime: Date;
  CompanyId: 13;
}

export function generateMockAuditRecord(): AuditRecord {
  return {
    $type: 'Payfactors.Domain.TotalRewards.Audit.EditAuditRecordDto, Payfactors.Domain',
    EditedById: 12689,
    EditedBy: 'edited by',
    EditedDateTime: new Date('2020-04-15T20:06:39.817Z'),
    CreatedById: 12689,
    CreatedBy: 'created by',
    CreatedDateTime: new Date('2020-04-13T17:54:21.42Z'),
    CompanyId: 13,
  };
}
