import { Component, ViewChild, Input, ChangeDetectionStrategy } from '@angular/core';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { ListCompositeFields } from 'libs/models/payfactors-api';

@Component({
  selector: 'pf-secondary-survey-fields-modal',
  templateUrl: './secondary-survey-fields-modal.component.html',
  styleUrls: ['./secondary-survey-fields-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class SecondarySurveyFieldsModalComponent {
  @Input() surveyFields: ListCompositeFields[];

  @ViewChild('secondarySurveyFieldsModal', { static: true })
  secondarySurveyFieldsModal: any;
  modalRef: NgbModalRef;
  secondarySurveyFields: ListCompositeFields[];

  constructor(
    private modalService: NgbModal
  ) {}


  open() {
    this.modalRef = this.modalService.open(this.secondarySurveyFieldsModal, {backdrop: 'static', size: 'sm'});
    this.secondarySurveyFields = this.surveyFields.filter(sf => (sf.IsSecondary));
  }
}
