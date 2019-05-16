export class RoleDataRestriction {
  Id: number;
  RoleId: number;
  DataConditionIsEqual: boolean;
  DataFieldId: number;
  DataValue: any;
}


export function getMockRoleDataRestrictions() {
  return [{RoleId: 1,
    DataConditionIsEqual: true,
    DataFieldId: 1,
    DataValue: null}];
}
