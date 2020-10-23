import { FieldFormatType } from 'libs/models/payfactors-api';

export const dateFormatCasing = {
  'MM/DD/YYYY': 'MM/dd/yyyy',
  'M/D/YY': 'M/d/yy',
  'M/D/YYYY': 'M/d/yyyy',
  'DD/MM/YYYY' : 'dd/MM/yyyy'
};

export const formatTypeMapping = {
  'int': 'number',
  'float': 'number',
  'dateTime': 'date'
};

export function getKendoNumericFormatFromFormat(format: string, type: FieldFormatType): string {
  const parsedFormat = format.split('-');
  const formatPrefix = type === FieldFormatType.Percent ? 'p' : 'n';
  return parsedFormat.length === 2 ? `${formatPrefix}${parseInt(parsedFormat[1], 0)}` : 'n';
}
