export interface ProjectListTooltipResponse {
  ProjectId: number;
}

export interface UserTooltipMetadata {
  FirstName: string;
  LastName: string;
  LastViewed: Date;
  Title: string;
  UserPicture: string;
}

export interface SharedTooltipResponse extends ProjectListTooltipResponse {
  Data: UserTooltipMetadata[];
}

export interface JobsTooltipResponse extends ProjectListTooltipResponse {
  Data: string[];
}
