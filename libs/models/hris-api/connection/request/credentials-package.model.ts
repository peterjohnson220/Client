export interface CredentialsPackage {
  providerCode: string;
  syncEmployees: boolean;
  syncJobs: boolean;
  syncPaymarkets: boolean;
  syncStructures: boolean;
  syncStructureMappings: boolean;
}

export function generateMockCredentialsPackage(): CredentialsPackage {
  return {
    providerCode: 'PFTEST',
    syncEmployees: true,
    syncJobs: false,
    syncPaymarkets: false,
    syncStructures: false,
    syncStructureMappings: false
  };
}
