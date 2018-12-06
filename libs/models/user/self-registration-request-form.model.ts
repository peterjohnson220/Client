export interface SelfRegistrationRequestForm {
  FirstName: string;
  LastName: string;
  Email: string;
  Title: string;
  CompanyName: string;
  Website: string;
  NumberEmployees: number;
}

export function generateMockSelfRegistrationRequestForm(): SelfRegistrationRequestForm {
  return {
    FirstName: 'string',
    LastName: 'string',
    Email: 'string',
    Title: 'string',
    CompanyName: 'string',
    Website: 'string',
    NumberEmployees: 0
  };
}
