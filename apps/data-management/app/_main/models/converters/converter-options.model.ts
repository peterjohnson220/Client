import { DateFormat, generateMockDateFormat } from './date-format-converter.model';

export class ConverterOptions {
  DateFormat: DateFormat;
}

export function generateMockConverterOptions() {
  return {
    DateFormat: generateMockDateFormat()
  };
}
