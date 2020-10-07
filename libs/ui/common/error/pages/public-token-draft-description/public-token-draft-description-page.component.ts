import { Component, OnInit} from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import { UserContext } from 'libs/models/security';

@Component({
    selector: 'pf-public-token-draft-description-page',
    templateUrl: 'public-token-draft-description-page.component.html',
    styleUrls: ['public-token-draft-description-page.component.scss']
  })
  export class PublicTokenDraftDescriptionPageComponent implements OnInit {

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
