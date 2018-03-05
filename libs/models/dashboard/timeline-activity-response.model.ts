import { TimelineActivityDto } from './timeline-activity-dto.model';

export interface TimelineActivityResponse {
  ViewModels: TimelineActivityDto[];
  CurrentPage: number;
  TotalPages: number;
  TotalRecords: number;
  HasMoreDataToReturn: boolean;
}
