import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { KeyboardKeys } from 'libs/constants';

@Component({
  selector: 'pf-verification',
  templateUrl: './verification.page.html',
  styleUrls: ['./verification.page.scss']
})
export class VerificationPageComponent implements OnInit {
  @ViewChildren('inputToFocus') inputToFocus: QueryList<ElementRef>;

  verificationInputForm: FormGroup;
  maxInputLength: number[];
  focusNextInput: boolean;
  currentYear = new Date().getFullYear();
  specialKeys = [
    KeyboardKeys.SHIFT,
    KeyboardKeys.ESCAPE,
  ];

  constructor(private fb: FormBuilder) {
    this.maxInputLength = Array(6).fill(0).map((x, i) => i);
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.verificationInputForm = this.fb.group({
      inputs: this.fb.group({
        input0: '',
        input1: '',
        input2: '',
        input3: '',
        input4: '',
        input5: '',
      })
    });
  }

  highlightValue(index: number): void {
    if (index <= this.maxInputLength.length - 1) {
      this.inputToFocus.toArray()[index].nativeElement?.select();
    }
  }

  handleKeyUp(e: KeyboardEvent, index: number): void {
    this.focusNextInput = this.handleFocusNextInput(e);
    if (this.inputToFocus.toArray().length - 1 !== index && this.focusNextInput && index <= this.maxInputLength.length - 1) {
      this.inputToFocus.toArray()[index + 1].nativeElement.focus();
      this.inputToFocus.toArray()[index + 1].nativeElement.select();
    }
  }

  get disableButton(): boolean {
    const inputs = this.verificationInputForm.value.inputs;
    return Object.keys(inputs).map(i => inputs[i]).includes('');
  }

  private handleFocusNextInput(e: KeyboardEvent): boolean {
    const hasValue = !!(e.target as HTMLInputElement).value;
    const containsSpecialKey = this.specialKeys.findIndex(x => x.toString() === e.key) !== -1;
    return hasValue && !containsSpecialKey;
  }
}
