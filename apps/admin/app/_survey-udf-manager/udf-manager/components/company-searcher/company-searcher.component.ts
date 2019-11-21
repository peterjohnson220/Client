import { Component, EventEmitter, Input, Output } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { CompanyBaseInformation } from 'libs/models/company';

const take = 100;

@Component({
  selector: 'pf-company-searcher',
  templateUrl: './company-searcher.component.html',
  styleUrls: ['./company-searcher.component.scss']
})
export class CompanySearcherComponent {

  @Input() loadingCompaniesList: boolean;
  @Input() companiesList: CompanyBaseInformation[];
  @Input() selectedCompany: CompanyBaseInformation;

  @Output() selectCompany = new EventEmitter<CompanyBaseInformation>();
  @Output() unselectCompany = new EventEmitter();
  @Output() filterCompanies = new EventEmitter<{ searchTerm: string, take: number }>();

  searchTermChanged$ = new BehaviorSubject<string>('');

  constructor() {
    this.searchTermChanged$.pipe(
      debounceTime(400),
      distinctUntilChanged()
    )
    .subscribe(searchTerm => this.filterCompanies.emit({ searchTerm, take }));
  }

  handleCompanyListFilter(searchTerm: string) {
    this.searchTermChanged$.next(!searchTerm ? '' : searchTerm);
  }

  setSelectedCompany(company: CompanyBaseInformation) {
    if (company) {
      this.selectCompany.emit(company);
    } else {
      this.unselectCompany.emit();
    }
  }

}
