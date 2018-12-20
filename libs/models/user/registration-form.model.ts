export interface RegistrationForm {
  FirstName: string;
  LastName: string;
  Email: string;
  Title: string;
  CompanyName: string;
  Website: string;
  NumberEmployees: number;
}

export function generateMockRegistrationForm(): RegistrationForm {
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
