import {MrpFieldsModel} from '../models/mrp-fields.model';

export const FILETYPES: string [] = ['.CSV', '.XLSX'];
export const MRPFIELDS: MrpFieldsModel [] [] = [
  [{ Name: 'Base', Value: 50, Min: 1, Max: 100}, { Name: 'TDC', Value: 50, Min: 1, Max: 100}, { Name: 'Bonus %', Value: 50, Min: 1, Max: 100}, { Name: 'Match Weight', Value: 1, Min: 1, Max: 100}],
  [{ Name: 'TCC', Value: 50, Min: 1, Max: 100}, { Name: 'Allow', Value: 50, Min: 1, Max: 100}, { Name: 'Bonus Target', Value: 50, Min: 1, Max: 100}, { Name: 'Composite  Adj', Value: 0, Min: 0, Max: 100}],
  [{ Name: 'Bonus', Value: 50, Min: 1, Max: 100}, { Name: 'Fixed', Value: 50, Min: 1, Max: 100}, { Name: 'Bonus Target %', Value: 50, Min: 1, Max: 100}],
  [{ Name: 'TCC Target', Value: 50, Min: 1, Max: 100}, { Name: 'Renum', Value: 50, Min: 1, Max: 100}, { Name: 'Target LTIP', Value: 50, Min: 1, Max: 100}],
  [{ Name: 'LTIP', Value: 50, Min: 1, Max: 100}, { Name: 'TGP', Value: 50, Min: 1, Max: 100}, { Name: 'Target TDC', Value: 50, Min: 1, Max: 100}]
];
