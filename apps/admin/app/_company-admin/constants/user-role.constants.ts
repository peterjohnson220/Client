export enum UserRoleTabState {
  DATA_ACCESS,
  FUNCTION,
  USERS
}

export namespace UserRoleTabState {

  export function values() {
    return Object.keys(UserRoleTabState).filter(
      (type) => isNaN(<any>type) && type !== 'values'
    );
  }
}

export enum SaveButtonText {
  Save = 'Save',
  Saving = 'Saving',
  Success = 'Success'
}
