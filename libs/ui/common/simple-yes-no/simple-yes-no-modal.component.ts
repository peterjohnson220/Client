import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { SimpleYesNoModalOptions} from 'libs/models/common';

@Component({
  selector: 'pf-simple-yes-no-modal',
  templateUrl: './simple-yes-no-modal.component.html'
})
export class SimpleYesNoModalComponent {
  @ViewChild('simpleModal', { static: true }) public simpleModal: any;
  @Input() opts: SimpleYesNoModalOptions;
  @Output() actionConfirmed = new EventEmitter();

  private modalRef: NgbModalRef;
  private modalContext: any;
  private confirmButtonClass: string;

  constructor(
    private modalService: NgbModal
  ) { }

  open(context: any) {
    this.confirmButtonClass = this.opts.IsDelete ? 'btn-danger' : 'btn-primary';
    this.modalRef = this.modalService.open(this.simpleModal, { backdrop: 'static' });
    this.modalContext = context;
  }

  confirmed() {
    this.actionConfirmed.emit(this.modalContext);
    this.modalRef.close();
  }
}
