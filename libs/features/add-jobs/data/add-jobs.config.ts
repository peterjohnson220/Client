interface IAddJobsConfig {
  enableCreateNewJobs: boolean;
  enablePaymarkets: boolean;
  enableAssignedStructuresMetadata: boolean;
  enabledJobSourceOrTitle: boolean;
}

export abstract class AddJobsConfig implements IAddJobsConfig {
  enableCreateNewJobs: boolean;
  enablePaymarkets: boolean;
  enableAssignedStructuresMetadata: boolean;
  enabledJobSourceOrTitle: boolean;
}
