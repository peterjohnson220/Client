import { Component, Input} from '@angular/core';

import { CompanyDetail } from '../../models';


@Component({
  selector: 'pf-company-detail-card',
  templateUrl: './company-detail-card.component.html',
  styleUrls: ['./company-detail-card.component.scss']
})
export class CompanyDetailCardComponent {
  @Input() companyDetail: CompanyDetail;

  constructor() {}
}
