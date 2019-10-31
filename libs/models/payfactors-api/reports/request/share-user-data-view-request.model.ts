export interface ShareUserDataViewRequest {
  UserDataViewId: number;
  UserPermissions: SharedUserPermission[];
}

export interface SharedUserPermission {
  UserId: number;
  CanEdit: boolean;
}
