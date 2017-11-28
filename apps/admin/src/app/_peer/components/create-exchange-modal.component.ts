import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'pf-create-exchange-modal',
  templateUrl: './create-exchange-modal.component.html',
  styleUrls: ['./create-exchange-modal.component.scss']
})
export class CreateExchangeModalComponent {
  @Output() createExchangeEvent = new EventEmitter();
  @ViewChild('content') modal: any;
  private createExchangeForm: FormGroup;

  constructor(private modalService: NgbModal, private fb: FormBuilder) {
    this.createForm();
  }

  createForm(): any {
    this.createExchangeForm = this.fb.group({
      'name': ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  createExchange() {
    console.log(this.name);
    this.createExchangeEvent.emit(this.name);
  }

  open() {
    this.createExchangeForm.reset();
    return this.modalService.open(this.modal).result;
  }

  get name() { return this.createExchangeForm.get('name'); }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }
}
