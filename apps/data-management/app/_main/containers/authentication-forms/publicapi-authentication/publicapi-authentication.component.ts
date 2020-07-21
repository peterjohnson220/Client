import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'pf-publicapi-authentication',
  templateUrl: './publicapi-authentication.component.html',
  styleUrls: ['./publicapi-authentication.component.scss']
})
export class PublicApiAuthenticationComponent implements OnInit {

  @Input() validated = false;
  @Input() waitingForAuthentication = false;

  @Output() submitClick = new EventEmitter();
  @Output() cancelClick = new EventEmitter();
  @Output() backClick = new EventEmitter();

  publicKeyForm: FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder) {

  }

  ngOnInit() {
    this.initForm();
    this.createNewUUID();
  }

  onSubmit() {
    this.submitted = true;
    if (this.publicKeyForm.invalid) {
      return;
    }
    this.submitClick.emit(this.publicKeyForm.value);
  }

  cancelAuthenticationClick() {
    this.publicKeyForm.reset();
    this.cancelClick.emit();
  }

  backBtnClick() {
    this.backClick.emit();
  }

  createNewUUID() {
    this.publicKeyForm.controls.apikey.setValue(uuidv4());
  }

  initForm(): void {
    this.publicKeyForm = this.formBuilder.group({
      apikey: [ '', [ Validators.required, Validators.pattern(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i) ] ]
    });
  }
}
