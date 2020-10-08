export class DateFormat {
  DateTimeFormat: string;
  CultureInfo?: any = null;
  DateTimeStyles?: any = null;
}

export function generateMockDateFormat(): DateFormat {
  return {
    DateTimeFormat: 'YYYY-MM-ddzzz'
  };
}
