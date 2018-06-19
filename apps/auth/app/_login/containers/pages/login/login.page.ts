import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { MarketingImageDto } from 'libs/models/marketing/marketing-image-dto.model';
import * as fromMarketingReducer from '../../../../../../admin/app/_marketing/reducers/marketing-image.reducer';
import * as fromMarketingActions from '../../../../../../admin/app/_marketing/actions/marketing-image.actions';

@Component({
  selector: 'pf-login-page',
  templateUrl: './login.page.html',
  styleUrls: [ './login.page.scss' ]
})
export class LoginPageComponent implements OnInit {
  loginLogo = 'assets/images/MarketingPlaceholder.PNG';
  marketingImage$: Observable<MarketingImageDto>;
  gettingMarketingImage$: Observable<boolean>;
  gettingMarketingImageError$: Observable<boolean>;
  gettingMarketingImageSuccess$: Observable<boolean>;

  imageLocation: string;

  constructor(private store: Store<fromMarketingReducer.State>) {
    this.marketingImage$ = store.select(fromMarketingReducer.getMarketingImage);
    this.gettingMarketingImage$ = store.select(fromMarketingReducer.getGettingMarketingImage);
    this.gettingMarketingImageError$ = store.select(fromMarketingReducer.getGettingMarketingImageError);
    this.gettingMarketingImageSuccess$ = store.select(fromMarketingReducer.getGettingMarketingImageSuccess);
  }

  ngOnInit() {
      this.store.dispatch(new fromMarketingActions.GetMarketingImage());

      this.marketingImage$.subscribe(image => {
        if ( image ) {
          this.imageLocation = image.Location;
        }
      }
    );


    this.gettingMarketingImageSuccess$.subscribe(image => {
      if ( image ) {
         }
    }
  );

  }
}

