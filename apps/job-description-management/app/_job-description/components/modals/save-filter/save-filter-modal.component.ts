import { Component, ViewChild, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { JdmListFilter } from 'libs/models/user-profile';

import { CustomValidators } from '../../../../shared/validators/custom-validators.validator';

@Component({
  selector: 'pf-save-filter-modal',
  templateUrl: './save-filter-modal.component.html'
})
export class SaveFilterModalComponent implements OnInit {
  @ViewChild('saveFilterModal', { static: true }) public saveFilterModal: any;

  @Output() saved = new EventEmitter();
  @Output() opened = new EventEmitter();
  @Input() saving = false;

  @Input() errorSaving = false;
  @Input() userFilters: JdmListFilter[] = [];

  public modalRef: NgbModalRef;
  public filterForm: FormGroup;
  public attemptedSave = false;

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.buildForm();
  }

  open() {
    this.opened.emit();
    this.attemptedSave = false;
    this.filterForm.reset();
    this.modalRef = this.modalService.open(this.saveFilterModal, { backdrop: 'static' });
  }

  close() {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }

  save() {
    this.attemptedSave = true;
    if (this.filterForm.valid) {
      this.saved.emit(this.filterForm.controls['name'].value);
    }
  }

  buildForm() {
    this.filterForm = this.formBuilder.group({
      name: ['', [CustomValidators.required, Validators.maxLength(100), this.notBlackListed().bind(this)]]
    });
  }

  notBlackListed() {
    return function(c: FormControl) {
      const blackList = this.userFilters ? this.userFilters.map(uf => uf.Name) : [];
      const blackListed = blackList ? !!blackList.find(bl => bl === c.value) : false;
      return blackListed ? {'notBlackListed': {valid: false}} : null;
    };
  }
}
