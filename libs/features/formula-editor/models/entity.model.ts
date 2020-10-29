export interface Entity {
  Id: number;
  Name: string;
  IsBaseEntity: boolean;
  RequiredInfo?: EntityData[];
}

export function generateMockEntity(): Entity {
  return {
    Id: 2,
    Name: 'Jobs',
    IsBaseEntity: true
  };
}

export interface EntityData {
  FieldName: string;
  DisplayName: string;
  Type: string;
  Value: string;
}
