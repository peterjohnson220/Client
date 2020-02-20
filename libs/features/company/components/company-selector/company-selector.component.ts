import { Component, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import * as fromCompanySelectorActions from 'libs/features/company/actions/';
import * as fromCompanyReducer from 'libs/features/company/reducers/';

import { CompanySelectorItem } from '../../models';

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
        // DKG - we need the selected company in the sub-list so that the reference is held
        // and the selected company appears when the drop down isn't open
        if (this.selectedCompany && this.filteredData.findIndex(a => a.CompanyId === this.selectedCompany.CompanyId) < 0) {
          this.filteredData.push(this.selectedCompany);
        }
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
