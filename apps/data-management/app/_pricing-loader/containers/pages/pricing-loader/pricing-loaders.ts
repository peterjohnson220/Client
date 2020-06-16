import {Component, OnInit} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {Store} from '@ngrx/store';
import {filter, take, takeUntil} from 'rxjs/operators';
import {environment} from 'environments/environment';
import {CompanySelectorItem} from 'libs/features/company/models';
import * as fromCompanyReducer from 'libs/features/company/reducers';
import * as fromCompanySelectorActions from 'libs/features/company/actions';
import { EntityChoice, getEntityChoicesForPricingLoader } from '../../../models';
import { FILETYPES, MRPFIELDS } from '../../../constants';

@Component({
  selector: 'pf-pricing-loaders',
  templateUrl: './pricing-loaders.html',
  styleUrls: ['./pricing-loaders.scss']
})

export class PricingLoadersComponent implements OnInit {
  private unsubscribe$ = new Subject();
  private companies$: Observable<CompanySelectorItem[]>;
  private selectedCompany$: Observable<CompanySelectorItem>;
  public selectedCompany: CompanySelectorItem = null;
  entities: EntityChoice[];
  env = environment;
  isCollapsed = false;
  fileTypes = FILETYPES;
  MRPFields = MRPFIELDS;

  constructor(private companyStore: Store<fromCompanyReducer.State>) {
    this.entities  = getEntityChoicesForPricingLoader();
    this.companies$ = this.companyStore.select(fromCompanyReducer.getCompanies);
    this.selectedCompany$ = this.companyStore.select(fromCompanyReducer.getSelectedCompany);

    this.selectedCompany$.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(f => {
      this.selectedCompany = f;
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
    this.companyStore.dispatch(new fromCompanySelectorActions.GetCompanies());
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
}

