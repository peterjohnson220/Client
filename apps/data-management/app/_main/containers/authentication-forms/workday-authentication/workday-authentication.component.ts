import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'pf-workday-authentication',
  templateUrl: './workday-authentication.component.html',
  styleUrls: ['./workday-authentication.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkdayAuthenticationComponent implements OnInit {

  @Input() validated = false;

  @Output() submitClick = new EventEmitter();
  @Output() cancelClick = new EventEmitter();
  @Output() backClick = new EventEmitter();

  workdayForm: FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder) {

  }

  ngOnInit() {
    this.initForm();
  }

  onSubmit() {
    this.submitted = true;

    if (this.workdayForm.invalid) {
      return;
    }

    this.submitClick.emit(this.workdayForm.value);
  }

  cancelAuthenticationClick() {
    this.workdayForm.reset();
    this.cancelClick.emit();
  }

  backBtnClick() {
    this.backClick.emit();
  }

  initForm(): void {
    this.workdayForm = this.formBuilder.group({
      domain: ['', Validators.required ],
      username: [ '', [Validators.required, Validators.pattern(/^\S+@\S+$/)]],
      password: [ '', Validators.required ]
    });
  }
}
