import { CompanyStructure, generateMockCompanyStructure } from './company-structure.model';

export interface CompanyStructureView {
  Tag: string;
  IsFavorite: boolean;
  DefaultTag: string;
  StructuresOrder?: number;
  FavoritesOrder?: number;
  Structure: CompanyStructure;
}

export function generateMockCompanyStructureView(): CompanyStructureView {
  return {
    Tag: '',
    IsFavorite: false,
    DefaultTag: '',
    StructuresOrder: 1,
    FavoritesOrder: 2,
    Structure: generateMockCompanyStructure()
  };
}
