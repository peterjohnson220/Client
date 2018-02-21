import { TimelineActivityDto } from '../../../../../../libs/models/dashboard';
import { TimelineActivity } from '../models';

export class TimelineActivityDtoToTimelineActivityMapper {
  static mapFromDto(dtos: TimelineActivityDto[]): TimelineActivity[] {
    const timelineActivities = [];
    let i = 1;
    for (const dto of dtos) {
      timelineActivities.push({
        Id: dto.Type + String(i++),
        Type: dto.Type,
        SubType: dto.SubType,
        PostedBy: dto.PostedBy,
        PostedTime: dto.PostedBy,
        Subject: dto.Subject,
        Body: dto.Body,
        AvatarUrl: dto.AvatarUrl,
        IsVisible: true
      });
    }
    return timelineActivities;
  }
}
