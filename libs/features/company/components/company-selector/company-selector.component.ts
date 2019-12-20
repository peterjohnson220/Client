import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { CompanySelectorItem } from 'apps/admin/app/_survey-library/models';

import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';

import * as fromCompanySelectorActions from 'libs/features/company/actions/';
import * as fromCompanyReducer from 'libs/features/company/reducers/';

@Component({
  selector: 'pf-company-selector',
  templateUrl: './company-selector.component.html',
  styleUrls: ['./company-selector.component.scss']
})
export class CompanySelectorComponent implements OnInit, OnDestroy {

  selectedCompany: CompanySelectorItem;

  companies: CompanySelectorItem[];
  filteredData: CompanySelectorItem[];
  private companies$: Observable<CompanySelectorItem[]>;
  private selectedCompany$: Observable<CompanySelectorItem>;
  private unsubscribe$ = new Subject();
  public isLoading$: Observable<boolean>;

  ngOnInit(): void {
    if (!this.companies || this.companies.length === 0) {
      this.store.dispatch(new fromCompanySelectorActions.GetCompanies());
    }
  }

  constructor(private store: Store<fromCompanyReducer.State>) {
    this.companies$ = store.select(fromCompanyReducer.getCompanies);
    this.isLoading$ = store.select(fromCompanyReducer.getCompaniesLoading);
    this.selectedCompany$ = store.select(fromCompanyReducer.getSelectedCompany);

    this.selectedCompany$.subscribe(f => {
      this.selectedCompany = f;
    });

    this.companies$.pipe(
      filter(uc => !!uc),
      takeUntil(this.unsubscribe$))
      .subscribe(f => {
        this.companies = f;
        this.filteredData = this.companies.slice(0, 20);
      });
  }

  public filterData(filterValue: string) {
    this.filteredData = this.companies.filter((s) => s.CompanyName.toLowerCase().indexOf(filterValue.toLowerCase()) !== -1).slice(0, 20);
  }

  public setSelectedCompany(selectedCompany: CompanySelectorItem) {
    this.store.dispatch(new fromCompanySelectorActions.SetSelectedCompany(selectedCompany));
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(true);
  }
}
