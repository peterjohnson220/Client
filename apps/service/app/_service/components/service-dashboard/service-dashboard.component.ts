import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { SettingsService } from 'libs/state/app-context/services';
import { FeatureAreaConstants, UiPersistenceSettingConstants } from 'libs/models/common';

import * as fromServicePageReducer from '../../reducers';
import * as fromServicePageActions from '../../actions/service-page.actions';
import { SupportTeamUser, SupportTeam } from '../../models';

@Component({
  selector: 'pf-service-dashboard',
  templateUrl: './service-dashboard.component.html',
  styleUrls: ['./service-dashboard.component.scss']
})
export class ServiceDashboardComponent implements OnInit, OnDestroy {
  @Input() supportTeamUsers: SupportTeamUser[];
  @Input() avatarUrl: string;

  isOpen$: Observable<boolean>;

  isOpenSubscription: Subscription;

  isOpen: boolean;
  supportTeam = SupportTeam;

  staticSupportTeams = [
    {
      TeamName: 'Compensation Team',
      TeamEmail: 'compensationteam@payfactors.com',
      Team: SupportTeam.Compensation,
      IconClass: ['far', 'calculator']
    },
    {
      TeamName: 'Peer Team',
      TeamEmail: 'peer.services@payfactors.com',
      Team: SupportTeam.Peer,
      IconClass: ['far', 'exchange-alt']
    }
  ];

  constructor(
    private store: Store<fromServicePageReducer.State>,
    private settingsService: SettingsService
  ) {
    this.isOpen$ = this.settingsService.selectUiPersistenceSetting<boolean>(
      FeatureAreaConstants.Service, UiPersistenceSettingConstants.ServiceSupportTeamDashboardOpen
    );
  }

  ngOnInit(): void {
    this.isOpenSubscription = this.isOpen$.subscribe(value => {
      this.isOpen = value !== null ? value : true;
    });
  }

  ngOnDestroy(): void {
    this.isOpenSubscription.unsubscribe();
  }

  toggle(): void {
    this.isOpen = !this.isOpen;
    this.store.dispatch(new fromServicePageActions.SaveSupportTeamDashboardOpenSetting({
      settingValue: this.isOpen
    }));
  }
}
