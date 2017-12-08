export interface TimelineActivity {
  Type: string;
  SubType: string;
  PostedBy: string;
  PostedTime: string;
  Subject: string;
  Body: string;
  AvatarUrl: string;
}


export function getMockTimelineActivities(type = 'mockType', subType = 'mockSubType'): TimelineActivity[] {
  return [{
    Type: type,
    SubType: subType,
    PostedBy: 'John Clark',
    PostedTime: '3m ago',
    Subject: 'Replied To Mike Davidson\'s post',
    Body: 'Reply to Loriem Ipsum is simple a dummy text of the printing and typesetting industry.',
    AvatarUrl: '/assets/john.png'
  }];
}
