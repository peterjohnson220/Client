export interface CredentialsPackage {
  ProviderCode: string;
  SyncEmployees: boolean;
  SyncJobs: boolean;
  SyncPaymarkets: boolean;
  SyncStructures: boolean;
  SyncStructureMappings: boolean;
}

export function generateMockCredentialsPackage(): CredentialsPackage {
  return {
    ProviderCode: 'PFTEST',
    SyncEmployees: true,
    SyncJobs: false,
    SyncPaymarkets: false,
    SyncStructures: false,
    SyncStructureMappings: false
  };
}
