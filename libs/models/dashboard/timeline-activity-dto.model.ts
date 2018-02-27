export interface TimelineActivityDto {
  Type: string;
  SubType: string;
  Internal: boolean;
  CompanyName: string;
  PostedBy: TimelineActivityPersonDto;
  PostedTime: string;
  ElapsedTime: string;
  Body: string;
  Links: TimelineActivityLinkDto[];
}

export interface TimelineActivityPersonDto {
  Name: string;
  AvatarUrl: string;
  PayfactorsEmployee: boolean;
}

export interface TimelineActivityLinkDto {
  Type: string;
  Url: string;
  DisplayName: string;
}
