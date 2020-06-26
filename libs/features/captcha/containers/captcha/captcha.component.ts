import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { Subscription } from 'rxjs';

import { CaptchaService } from '../../services';

@Component({
  selector: 'pf-captcha',
  templateUrl: './captcha.component.html',
  styleUrls: ['./captcha.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CaptchaComponent),
      multi: true
    }
  ]
})
export class CaptchaComponent implements OnInit, OnDestroy, ControlValueAccessor {
  @ViewChild('captchaContainer', { static: true }) captchaContainer: ElementRef;
  @Output() captchaToken = new EventEmitter<string>();

  private captchaLoadedSub: Subscription;
  private captchaId: number;
  private onChange: (token: string) => void;
  private onTouched: () => void;

  constructor(private captchaService: CaptchaService) { }

  writeValue(value: any): void {
    if (!value && this.captchaId) {
      this.captchaService.reset(this.captchaId);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  ngOnInit(): void {
    this.captchaLoadedSub = this.captchaService.isLoaded$.subscribe(isLoaded => {
      if (isLoaded) {
        this.captchaId = this.captchaService.render(this.captchaContainer.nativeElement, this.captchaTokenCallback, this.captchaExpiredCallback);
      }
    });
  }

  ngOnDestroy(): void {
    this.captchaLoadedSub.unsubscribe();
  }

  private set token(value: string) {
    if (this.onChange) {
      this.onChange(value);
    }
    if (this.onTouched) {
      this.onTouched();
    }
  }

  private captchaTokenCallback = (response: string) => {
    this.captchaToken.emit(response);
    this.token = response;
  }

  private captchaExpiredCallback = () => {
    this.captchaToken.emit(null);
    this.token = null;
  }

}
