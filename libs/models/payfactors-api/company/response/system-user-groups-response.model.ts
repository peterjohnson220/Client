export interface SystemUserGroupsResponse {
  SystemUserGroupsId: number;
  GroupName: string;
  DisplayName: string;
}

export function generateMockSystemUserGroupsResponse(): SystemUserGroupsResponse {
  return {
    SystemUserGroupsId: 1,
    GroupName: 'MockGroup',
    DisplayName: 'MockGroup'
  };
}
