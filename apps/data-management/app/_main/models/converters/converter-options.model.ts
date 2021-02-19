import { DateFormat, generateMockDateFormat } from './date-format-converter.model';
import { generateMockValueMapping, ValueMapping } from './value-mapping.model';

export class ConverterOptions {
  DateFormat: DateFormat;
  MappingValues: ValueMapping[];
}

export function generateMockConverterOptions() {
  return {
    DateFormat: generateMockDateFormat(),
    MappingValues: [generateMockValueMapping()]
  };
}
