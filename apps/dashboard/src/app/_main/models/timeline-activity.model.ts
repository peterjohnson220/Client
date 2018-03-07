export interface TimelineActivity {
  Id: number;
  Type: string;
  SubType: string;
  PostedBy: string;
  PostedByInitials: string;
  PostedUrl: string;
  ElapsedTime: string;
  PostedTime: string;
  Subject: string;
  Body: string;
  AvatarUrl: string;
  IsVisible: boolean;
}


export function getMockTimelineActivities(type = 'mockType', subType = 'mockSubType'): TimelineActivity {
  return {
    Id: 1,
    Type: type,
    SubType: subType,
    PostedBy: 'John Clark',
    PostedByInitials: 'JC',
    PostedUrl: '#',
    PostedTime: '3m ago',
    ElapsedTime: '3m ago',
    Subject: 'Replied To Mike Davidson\'s post',
    Body: 'Reply to Loriem Ipsum is simple a dummy text of the printing and typesetting industry.',
    AvatarUrl: '/assets/john.png',
    IsVisible: true
  };
}
