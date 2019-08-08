export interface Topic {
  Id: string;
  TopicName: string;
}

export function generateMockTopic(): Topic {
  return {
    Id: '1234',
    TopicName: 'HRIS'
  };
}
