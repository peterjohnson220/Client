import { Component, ViewChild, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter,
  ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { PfValidators } from 'libs/forms/validators/pf-validators';

import { Entity, SaveUserWorkbookModalData, SaveWorkbookMode } from '../../models';

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
  @Input() saveError: boolean;
  @Input() saveNameConflict: boolean;
  @Input() lockedEntityName: string;
  @Input() reportName = '';
  @Input() summary = '';
  @Input() workbookMode = SaveWorkbookMode.NewWorkbook;
  @Output() saveClicked: EventEmitter<SaveUserWorkbookModalData> = new EventEmitter();

  @ViewChild('saveUserWorkbookModal', { static: true }) public saveUserWorkbookModal: any;
  saveUserWorkbookForm: FormGroup;
  defaultEntity: Entity;
  showErrorMessages: boolean;
  workbookModes = SaveWorkbookMode;

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
    this.resetForm();

    this.showErrorMessages = false;
  }

  save(): void {
    this.buildSaveUserWorkbookModalData();
    this.saveClicked.emit(this.modalData);
    this.showErrorMessages = true;
  }

  private createForm(): void {
    this.saveUserWorkbookForm = this.formBuilder.group({
      entity: [this.defaultEntity],
      name: [this.reportName, [PfValidators.required, Validators.maxLength(255)]],
      summary: [this.summary, [Validators.maxLength(300)]]
    });
  }

  private updateForm() {
    if (!!this.modalData && !!this.saveUserWorkbookForm) {
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

  private resetForm(): void {
    this.saveUserWorkbookForm.patchValue({
      entity: this.defaultEntity,
      name: this.reportName,
      summary: this.summary
    });
  }
}
