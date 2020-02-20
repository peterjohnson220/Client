export enum ConnectionStatusType {
  NoConnection = 'NoConnection',

  Authenticating = 'Authenticating',
  Authenticated  = 'Authenticated',
  AuthenticationError = 'AuthenticationError',

  MappingsComplete = 'MappingsComplete',
  MappingsIncomplete = 'MappingsIncomplete',
  MappingsMissing = 'MappingsMissing',

  ScheduleComplete = 'ScheduleComplete',
  ScheduleIncomplete = 'ScheduleIncomplete',
  ScheduleMissing = 'ScheduleMissing'
}
