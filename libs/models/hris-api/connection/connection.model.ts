export interface Connection {
  connection_ID?: number;
  provider_ID: number;
  company_ID: number;
  active: boolean;
}

export function generateMockConnection(): Connection {
  return {
    connection_ID: 1,
    provider_ID: 1,
    company_ID: 1,
    active: true,
  };
}
