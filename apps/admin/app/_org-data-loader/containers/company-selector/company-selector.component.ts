import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Company } from 'libs/models/company/company.model';

@Component({
  selector: 'pf-company-selector',
  templateUrl: './company-selector.component.html'
})
export class CompanySelectorComponent implements OnInit {
  @Input() loading: boolean;
  @Input() companies: Company[];
  @Output() companySelected = new EventEmitter<any>();

  selectedCompany: number;

  ngOnInit() {
  }

  onCompanySelected() {
    this.companySelected.emit(this.selectedCompany);
  }
}
