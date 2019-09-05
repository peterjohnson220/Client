import { Component, Output, EventEmitter, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'pf-test-authentication',
  templateUrl: './pf-test-authentication.component.html',
  styleUrls: ['./pf-test-authentication.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PfTestAuthenticationComponent implements OnInit {

  @Output() submitClick = new EventEmitter();
  @Output() cancelClick = new EventEmitter();

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

  initForm(): void {
    this.pfTestForm = this.formBuilder.group({
      apiKey: ['', Validators.required ]
    });
  }
}
