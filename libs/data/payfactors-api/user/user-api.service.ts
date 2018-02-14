import { Injectable } from '@angular/core';

import { HomePageLink } from '../../../models/user';

import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable()
export class UserApiService {
  private endpoint = 'User';

  constructor(
    private payfactorsApiService: PayfactorsApiService
  ) {}

  getUserHomePage(userId: number) {
    return this.payfactorsApiService
      .get<HomePageLink>(`${this.endpoint}(${userId})/Default.GetUserHomePage`);
  }
}
