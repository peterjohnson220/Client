import { NgModule } from '@angular/core';

import { UserModule } from './user';
import { UsersListModule } from './users-list';

@NgModule({
  exports: [
    UserModule,
    UsersListModule
  ]
})
export class UserManagementModule {}
