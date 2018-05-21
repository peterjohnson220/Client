import {
  Component, OnInit
} from '@angular/core';

import { NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'pf-terms-conditions-modal',
  templateUrl: './terms-conditions-modal.component.html',
  styleUrls: [ './terms-conditions-modal.component.scss' ]
})
export class TermsConditionsModalComponent implements OnInit {
  termsAndConditionsText: string;
  title: string;
  subTitle: string;

  constructor() {
  }


  ngOnInit(): void {
  }
}
