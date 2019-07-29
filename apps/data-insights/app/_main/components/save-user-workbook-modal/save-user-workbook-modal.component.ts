import { Component, ViewChild, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter,
  ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { PfValidators } from 'libs/forms/validators/pf-validators';

import { Entity, SaveUserWorkbookModalData } from '../../models';

@Component({
  selector: 'pf-save-user-workbook-modal',
  templateUrl: './save-user-workbook-modal.component.html',
  styleUrls: ['./save-user-workbook-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SaveUserWorkbookModalComponent implements OnInit, OnChanges {
  @Input() baseEntities: Entity[];
  @Input() modalData: SaveUserWorkbookModalData;
  @Input() saving: boolean;
  @Output() saveClicked: EventEmitter<SaveUserWorkbookModalData> = new EventEmitter();

  @ViewChild('saveUserWorkbookModal', { static: true }) public saveUserWorkbookModal: any;
  saveUserWorkbookForm: FormGroup;
  defaultEntity: Entity;

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.defaultEntity = this.baseEntities && this.baseEntities.length ? this.baseEntities[0] : null;
    this.createForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!!changes.modalData && !!changes.modalData.currentValue) {
      this.updateForm();
    }
  }

  get saveDisabled(): boolean {
    if (!this.saveUserWorkbookForm) {
      return this.saving;
    }

    return this.saving || !this.saveUserWorkbookForm.valid ||
      !(this.saveUserWorkbookForm.dirty || this.saveUserWorkbookForm.touched);
  }

  open(): void {
    this.modalService.open(this.saveUserWorkbookModal, { backdrop: 'static', centered: true });
  }

  close(): void {
    this.modalService.dismissAll();
    this.modalData = null;
    this.clearForm();
  }

  save(): void {
    this.buildSaveUserWorkbookModalData();
    this.saveClicked.emit(this.modalData);
    this.close();
  }

  private createForm(): void {
    this.saveUserWorkbookForm = this.formBuilder.group({
      entity: [this.defaultEntity],
      name: ['', [PfValidators.required, Validators.maxLength(255)]],
      summary: ['', [Validators.maxLength(300)]]
    });
  }

  private updateForm() {
    if (!!this.modalData) {
      this.saveUserWorkbookForm.patchValue({
        entity: this.modalData.Entity,
        name: this.modalData.Name,
        summary: this.modalData.Summary
      });
    }
  }

  private buildSaveUserWorkbookModalData(): void {
    this.modalData = {
      Entity: this.saveUserWorkbookForm.value.entity,
      Name: this.saveUserWorkbookForm.value.name,
      Summary: this.saveUserWorkbookForm.value.summary
    };
  }

  private clearForm(): void {
    this.saveUserWorkbookForm.patchValue({
      entity: this.defaultEntity,
      name: '',
      summary: ''
    });
  }
}
