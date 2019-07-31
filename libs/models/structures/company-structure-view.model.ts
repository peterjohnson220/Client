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

export function generateDefaultCompanyStructureView(structure: CompanyStructure): CompanyStructureView {
  return {
    Tag: '',
    IsFavorite: false,
    DefaultTag: structure.StructureCode,
    StructuresOrder: 1,
    FavoritesOrder: 2,
    Structure: structure
  };
}
