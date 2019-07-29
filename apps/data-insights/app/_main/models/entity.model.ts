export interface Entity {
  Id: number;
  Name: string;
  IsBaseEntity: boolean;
}

export function generateMockEntity(): Entity {
  return {
    Id: 2,
    Name: 'Jobs',
    IsBaseEntity: true
  };
}
