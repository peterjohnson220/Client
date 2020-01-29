import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'pf-workdaymock-authentication',
  templateUrl: './workdaymock-authentication.component.html',
  styleUrls: ['./workdaymock-authentication.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkdayMockAuthenticationComponent implements OnInit {

  @Input() validated = false;

  @Output() submitClick = new EventEmitter();
  @Output() cancelClick = new EventEmitter();
  @Output() backClick = new EventEmitter();

  workdayMockForm: FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder) {

  }

  ngOnInit() {
    this.initForm();
  }

  onSubmit() {
    this.submitted = true;

    if (this.workdayMockForm.invalid) {
      return;
    }

    this.submitClick.emit(this.workdayMockForm.value);
  }

  cancelAuthenticationClick() {
    this.workdayMockForm.reset();
    this.cancelClick.emit();
  }

  backBtnClick() {
    this.backClick.emit();
  }

  initForm(): void {
    this.workdayMockForm = this.formBuilder.group({
      domain: ['', Validators.required ],
      username: [ '', [Validators.required, Validators.pattern(/^\S+@\S+$/)]],
      password: [ '', Validators.required ]
    });
  }
}
