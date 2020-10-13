import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import cloneDeep from 'lodash/cloneDeep';

import { PfValidators } from 'libs/forms/validators';
import { StatementEmailTemplate } from 'libs/models/payfactors-api/total-rewards/response';
import { Statement } from 'libs/features/total-rewards/total-rewards-statement/models';

@Component({
  selector: 'pf-statement-email-template',
  templateUrl: './statement-email-template.component.html',
  styleUrls: ['./statement-email-template.component.scss']
})
export class StatementEmailTemplateComponent implements OnInit, OnChanges {
  @Input() statement: Statement;
  @Input() statementEmailTemplate: StatementEmailTemplate;

  readonly SUBJECT_MAX_LENGTH = 50;
  readonly CONTENT_MAX_LENGTH = 500;

  emailForm: FormGroup;
  rememberForNextTime: boolean;
  defaultEmailTemplate: StatementEmailTemplate;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.createForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.statement?.currentValue?.StatementName && !this.defaultEmailTemplate) {
      this.createDefaultEmailTemplate();
      this.updateForm(this.defaultEmailTemplate);
    }
  }

  get formControls() { return this.emailForm.controls; }

  get emailTemplate(): StatementEmailTemplate {
    const emailTemplate: StatementEmailTemplate = cloneDeep(this.emailForm.value);
    emailTemplate.StatementId = this.statement.StatementId;
    return emailTemplate;
  }

  get isValid(): boolean {
    if (!this.emailForm || !this.defaultEmailTemplate) {
      return true;
    }
    return this.emailForm.valid;
  }

  init(): void {
    this.rememberForNextTime = false;
    const emailTemplate = this.statementEmailTemplate ?? this.defaultEmailTemplate;
    this.updateForm(emailTemplate);
  }

  resetToDefault(): void {
    this.rememberForNextTime = false;
    this.updateForm(this.defaultEmailTemplate);
  }

  private createForm(): void {
    this.emailForm = this.formBuilder.group({
      EmailSubject: ['', [PfValidators.required, PfValidators.maxLengthTrimWhitespace(this.SUBJECT_MAX_LENGTH)]],
      EmailBody: ['', [PfValidators.required, PfValidators.maxLengthTrimWhitespace(this.CONTENT_MAX_LENGTH)]]
    });
  }

  private updateForm(template: StatementEmailTemplate): void {
    if (!!this.emailForm && !!template) {
      this.emailForm.patchValue({
        EmailSubject: template.EmailSubject,
        EmailBody: template.EmailBody
      });
    }
  }

  private createDefaultEmailTemplate(): void {
    if (!this.statement?.StatementName) {
      return;
    }
    this.defaultEmailTemplate = {
      EmailSubject: `Your ${this.statement.StatementName} is ready for review.`,
      EmailBody: `Your ${this.statement.StatementName} is ready for review.`
    };
  }
}
