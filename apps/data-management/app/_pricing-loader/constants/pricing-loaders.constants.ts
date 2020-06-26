import {MrpFieldsModel} from '../models/mrp-fields.model';

export const FILETYPES: string [] = ['.CSV', '.XLSX'];
export const MRPFIELDS: MrpFieldsModel [] [] = [
  [{ Name: 'Base', Value: 50, Min: 1, Max: 100, Decimal: 0}, { Name: 'TDC', Value: 50, Min: 1, Max: 100, Decimal: 0},
    { Name: 'Bonus %', Value: 50, Min: 1, Max: 100, Decimal: 0}, { Name: 'Match Weight', Value: 1, Min: 0.01, Max: 100, Decimal: 2}],
  [{ Name: 'TCC', Value: 50, Min: 1, Max: 100, Decimal: 0}, { Name: 'Allow', Value: 50, Min: 1, Max: 100, Decimal: 0},
    { Name: 'Bonus Target', Value: 50, Min: 1, Max: 100, Decimal: 0}, { Name: 'Composite  Adj', Value: 0, Min: -100, Max: 100, Decimal: 2}],
  [{ Name: 'Bonus', Value: 50, Min: 1, Max: 100, Decimal: 0}, { Name: 'Fixed', Value: 50, Min: 1, Max: 100, Decimal: 0},
    { Name: 'Bonus Target %', Value: 50, Min: 1, Max: 100, Decimal: 0}],
  [{ Name: 'TCC Target', Value: 50, Min: 1, Max: 100, Decimal: 0}, { Name: 'Renum', Value: 50, Min: 1, Max: 100, Decimal: 0},
    { Name: 'Target LTIP', Value: 50, Min: 1, Max: 100, Decimal: 0}],
  [{ Name: 'LTIP', Value: 50, Min: 1, Max: 100, Decimal: 0}, { Name: 'TGP', Value: 50, Min: 1, Max: 100, Decimal: 0},
    { Name: 'Target TDC', Value: 50, Min: 1, Max: 100, Decimal: 0}]
];
