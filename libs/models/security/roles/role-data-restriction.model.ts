export class RoleDataRestriction {
  Id: number;
  RoleId: number;
  DataConditionIsEqual: boolean;
  DataFieldId: number;
  DataValue: any;
}

export class RoleDataRestrictionValue {
  Id: string;
  Value: string;
}


export function getMockRoleDataRestrictions() {
  return [{
    Id: 0,
    RoleId: 1,
    DataConditionIsEqual: true,
    DataFieldId: 1,
    DataValue: null}];
}
