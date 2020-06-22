import { Component, OnInit, OnDestroy } from '@angular/core';

import { Observable, Subject, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { filter, take, takeUntil } from 'rxjs/operators';

import * as fromRootState from 'libs/state/state';
import * as fromCompanyReducer from 'libs/features/company/reducers';
import * as fromCompanySelectorActions from 'libs/features/company/actions';
import { environment } from 'environments/environment';
import { CompanySelectorItem } from 'libs/features/company/models';
import { ConfigurationGroup, EmailRecipientModel } from 'libs/models/data-loads';
import { LoadTypes } from 'libs/constants';
import { UserContext } from 'libs/models';

import * as fromPricingLoaderActions from '../../../actions/pricing-loader.actions';
import * as fromPricingLoaderMainReducer from '../../../reducers';
import { EntityChoice, getEntityChoicesForPricingLoader } from '../../../models';
import { FILETYPES, MRPFIELDS } from '../../../constants';

@Component({
  selector: 'pf-pricing-loaders',
  templateUrl: './pricing-loaders.html',
  styleUrls: ['./pricing-loaders.scss']
})

export class PricingLoadersComponent implements OnInit, OnDestroy {
  userContext$: Observable<UserContext>;
  processing$: Observable<boolean>;
  processingError$: Observable<boolean>;
  errorMessage$: Observable<string>;
  processingSuccess$: Observable<boolean>;

  userContextSubscription: Subscription;
  processingSuccessSubscription: Subscription;

  private unsubscribe$ = new Subject();
  private companies$: Observable<CompanySelectorItem[]>;
  private selectedCompany$: Observable<CompanySelectorItem>;
  public selectedCompany: CompanySelectorItem = null;
  entities: EntityChoice[];
  env = environment;
  isCollapsed = false;
  fileTypes = FILETYPES;
  MRPFields = MRPFIELDS;
  isEditingSetting: boolean;

  constructor(
    private companyStore: Store<fromCompanyReducer.State>,
    private store: Store<fromPricingLoaderMainReducer.State>,
    private rootStore: Store<fromRootState.State>
  ) {
    this.entities  = getEntityChoicesForPricingLoader();
    this.companies$ = this.companyStore.select(fromCompanyReducer.getCompanies);
    this.selectedCompany$ = this.companyStore.select(fromCompanyReducer.getSelectedCompany);
    this.userContext$ = this.rootStore.select(fromRootState.getUserContext);
    this.processing$ = this.store.select(fromPricingLoaderMainReducer.getProcessing);
    this.processingSuccess$ = this.store.select(fromPricingLoaderMainReducer.getProcessingSuccess);
    this.processingError$ = this.store.select(fromPricingLoaderMainReducer.getProcessingError);
    this.errorMessage$ = this.store.select(fromPricingLoaderMainReducer.getErrorMessage);

    this.selectedCompany$.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(f => {
      this.selectedCompany = f;
      this.setConfigGroup();
    });

    this.companies$.pipe(
      filter(uc => !!uc),
      take(1),
      takeUntil(this.unsubscribe$)
    ).subscribe(f => {
      this.companyStore.dispatch(new fromCompanySelectorActions.SetSelectedCompany(null));
    });
  }

  ngOnInit() {
    this.userContextSubscription = this.userContext$.subscribe(userContext => this.setEmailRecipient(userContext));
    this.companyStore.dispatch(new fromCompanySelectorActions.GetCompanies());
    this.processingSuccessSubscription = this.processingSuccess$.subscribe(success => {
      if (success) {
        this.companyStore.dispatch(new fromCompanySelectorActions.SetSelectedCompany(null));
      }
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.unsubscribe();
    this.userContextSubscription.unsubscribe();
    this.processingSuccessSubscription.unsubscribe();
  }

  selectedEntities(): EntityChoice[] {
    if (!this.entities) {
      return [];
    }
    return this.entities;
  }

  goBack() {
    window.location.href = this.env.siteAdminUrl;
  }

  textWidth(value: number) {
   return value.toString().length <= 3;
  }

  goDownload() {
    window.open('/client/data-management/pricing-loader/pricing-loaders-download?company=' +
      this.selectedCompany.CompanyId + '-' + this.selectedCompany.CompanyName, '_blank');
  }

  handleProcessClicked(): void {
    if (!this.selectedCompany) {
      return;
    }

    this.store.dispatch(new fromPricingLoaderActions.SaveConfig());
  }

  private setConfigGroup(): void {
    if (!this.selectedCompany) {
      this.store.dispatch(new fromPricingLoaderActions.ResetState());
      return;
    }
    const configGroup: ConfigurationGroup = {
      LoaderConfigurationGroupId: null,
      GroupName: '',
      CompanyId: this.selectedCompany.CompanyId,
      LoadType: LoadTypes.Manual,
      CreateNewConfigOverride: true
    };
    this.store.dispatch(new fromPricingLoaderActions.SetConfigGroup(configGroup));
  }

  private setEmailRecipient(userContext: UserContext): void {
    if (!userContext) {
      return;
    }
    const emailRecipient: EmailRecipientModel = {
      DataLoadEmailRecipientId: 0,
      CompanyId: userContext.CompanyId,
      UserId: userContext.UserId,
      EmailAddress: userContext.EmailAddress,
      FirstName: userContext.FirstName,
      LastName: userContext.LastName,
      LoaderType: 'Pricings',
      IsCompanyServicesRep: false,
      UserPicture: '',
      LoaderConfigurationGroupId: null
    };
    this.store.dispatch(new fromPricingLoaderActions.SetEmailRecipient(emailRecipient));
  }
}

