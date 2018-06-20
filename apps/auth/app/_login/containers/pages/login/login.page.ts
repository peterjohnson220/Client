import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { Store } from '@ngrx/store';

import { MarketingImageDto } from 'libs/models/marketing/marketing-image-dto.model';
import * as fromMarketingReducer from '../../../reducers';
import * as fromMarketingActions from '../../../actions/marketing-image.actions';

@Component({
  selector: 'pf-login-page',
  templateUrl: './login.page.html',
  styleUrls: [ './login.page.scss' ]
})
export class LoginPageComponent implements OnInit {
  marketingImage$: Observable<MarketingImageDto>;
  gettingMarketingImage$: Observable<boolean>;
  gettingMarketingImageError$: Observable<boolean>;
  gettingMarketingImageSuccess$: Observable<boolean>;
  imageLocation: string; // 'assets/images/MarketingPlaceholder.PNG';
  redirectUlr: string;

  constructor(public store: Store<fromMarketingReducer.State>) {
    this.marketingImage$ = this.store.select(fromMarketingReducer.getMarketingImage);
    this.gettingMarketingImage$ = this.store.select(fromMarketingReducer.getGettingMarketingImage);
    this.gettingMarketingImageError$ = this.store.select(fromMarketingReducer.getGettingMarketingImageError);
    this.gettingMarketingImageSuccess$ = this.store.select(fromMarketingReducer.getGettingMarketingImageSuccess);
  }

  ngOnInit() {
      this.store.dispatch(new fromMarketingActions.GetMarketingImage());

      this.marketingImage$.subscribe(image => {
        if ( image ) {
          this.imageLocation = image.Location;
          this.redirectUlr = image.RedirectUrl;
        }
      }
    );
  }
}

