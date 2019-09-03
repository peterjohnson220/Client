export enum UserRoleTabState {
  FUNCTION,
  DATA_ACCESS,
  USERS
}

export namespace UserRoleTabState {

  export function values() {
    return Object.keys(UserRoleTabState).filter(
      (type) => isNaN(<any>type) && type !== 'values'
    );
  }
}

// TODO: Remove/Refactor with RoleApiResponse
export enum SaveButtonText {
  Save = 'Save',
  Saving = 'Saving',
  Success = 'Success'
}

export enum RoleApiResponse {
  Success = 'Success',
  Error = 'An error has occurred while saving this role. Please contact Payfactors support for assistance',
  DeleteError = 'Unable to delete Role. Please contact Payfactors support for assistance'
}

export enum RoleApiNames {
  GetDataFieldValues = 'Role/GetRoleDataRestrictionValues?dataType='
}
