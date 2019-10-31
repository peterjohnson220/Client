import { Component, EventEmitter, Input, OnInit, OnChanges, SimpleChanges, Output } from '@angular/core';

import { Company } from 'libs/models/company';

@Component({
  selector: 'pf-company-searcher',
  templateUrl: './company-searcher.component.html',
  styleUrls: ['./company-searcher.component.scss']
})
export class CompanySearcherComponent implements OnInit, OnChanges {

  @Input() loadingCompaniesList: boolean;
  @Input() companiesList: Company[];
  @Input() selectedCompany: Company;

  @Output() selectCompany = new EventEmitter<Company>();
  @Output() unselectCompany = new EventEmitter();

  filteredCompaniesList: Company[] = [];

  constructor() { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges): void {
    const companies = changes.companiesList as any;
    if (!this.filteredCompaniesList.length && companies && companies.currentValue && companies.currentValue.length) {
      this.filteredCompaniesList = companies.currentValue;
    }
  }

  handleCompanyListFilter(searchTerm: string) {
    this.filteredCompaniesList = this.companiesList.filter((c) => {
      const isNameMatch = c.CompanyName.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1;

      const searchTermAsNumber = parseInt(searchTerm, 10);
      const isIdMatch = isNaN(searchTermAsNumber) ? false : c.CompanyId === searchTermAsNumber;

      return isNameMatch || isIdMatch;
    });
  }

  setSelectedCompany(company: Company) {
    if (company) {
      this.selectCompany.emit(company);
    } else {
      this.unselectCompany.emit();
    }
  }

}
