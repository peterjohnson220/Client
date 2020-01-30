import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'pf-test-authentication',
  templateUrl: './pf-test-authentication.component.html',
  styleUrls: ['./pf-test-authentication.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PfTestAuthenticationComponent implements OnInit {

  @Input() validated = false;

  @Output() submitClick = new EventEmitter();
  @Output() cancelClick = new EventEmitter();
  @Output() backClick = new EventEmitter();

  pfTestForm: FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder) {

  }

  ngOnInit() {
    this.initForm();
  }

  onSubmit() {
    this.submitted = true;
    if (this.pfTestForm.invalid) {
      return;
    }
    this.submitClick.emit(this.pfTestForm.value);
  }

  cancelAuthenticationClick() {
    this.pfTestForm.reset();
    this.cancelClick.emit();
  }

  backBtnClick() {
    this.backClick.emit();
  }


  initForm(): void {
    this.pfTestForm = this.formBuilder.group({
      username: [ '', [ Validators.required, Validators.pattern(/^\S+@\S+$/) ] ],
      password: [ '', Validators.required ]
    });
  }
}
