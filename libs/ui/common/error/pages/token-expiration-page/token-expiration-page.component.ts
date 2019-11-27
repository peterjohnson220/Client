import { Component, OnInit} from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import { UserContext } from 'libs/models/security';

@Component({
  selector: 'pf-token-expiration-page',
  templateUrl: 'token-expiration-page.component.html',
  styleUrls: ['token-expiration-page.component.scss']
})
export class TokenExpirationPageComponent implements OnInit {

  identity$: Observable<UserContext>;
  payfactorsLogo: string;

  constructor(private userContextStore: Store<fromRootState.State>) {
    this.identity$ = this.userContextStore.select(fromRootState.getUserContext);
  }

  ngOnInit() {
    this.identity$.subscribe(i => {
      if (i) {
        this.payfactorsLogo = i.ConfigSettings.find(c => c.Name === 'CloudFiles_PublicBaseUrl').Value + '/system_logos/payfactors-transparent.png';
      }
    });
  }
}
