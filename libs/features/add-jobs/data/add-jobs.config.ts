interface IAddJobsConfig {
  enableCreateNewJobs: boolean;
  enablePaymarkets: boolean;
}

export abstract class AddJobsConfig implements IAddJobsConfig {
  enableCreateNewJobs: boolean;
  enablePaymarkets: boolean;
}
