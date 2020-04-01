interface IAddJobsConfig {
  enableCreateNewJobs: boolean;
  enablePaymarkets: boolean;
  enableAssignedStructuresMetadata: boolean;
}

export abstract class AddJobsConfig implements IAddJobsConfig {
  enableCreateNewJobs: boolean;
  enablePaymarkets: boolean;
  enableAssignedStructuresMetadata: boolean;
}
