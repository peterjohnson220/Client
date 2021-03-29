import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ChangeDetectionStrategy,
  OnDestroy
} from '@angular/core';

import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Subject } from 'rxjs';

import { AbstractFeatureFlagService, FeatureFlags, RealTimeFlag } from 'libs/core/services/feature-flags';

@Component({
  selector: 'pf-string-editor',
  templateUrl: './string-editor.component.html',
  styleUrls: ['./string-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StringEditorComponent implements OnInit, OnChanges, OnDestroy {
  @Input() minCharacters = 1;
  @Input() maxCharacters: number;
  @Input() placeholder: string;
  @Input() inEditMode: boolean;
  @Input() icon: IconProp = 'pencil';
  @Input() value: string;
  @Input() showIcon: 'always' | 'never' | 'onHover' = 'onHover';
  @Input() isMultiline = false;
  @Input() showHoverText = false;
  @Input() showRadialTextCounter = false;
  @Input() showTextCounterTooltip = false;

  @Output() valueChange = new EventEmitter<string>();

  isEditable: boolean;
  isInEditState: boolean;

  availableWidth: number;
  contentWidth: number;

  totalRewardsRadialTextCountersFeatureFlag: RealTimeFlag = { key: FeatureFlags.TotalRewardsRadialTextCounters, value: false };
  unsubscribe$ = new Subject<void>();

  @ViewChild('textBox') textBox: ElementRef;
  @ViewChild('editAnchor') editAnchor: ElementRef;
  @ViewChild('editText') editText: ElementRef;

  constructor(private featureFlagService: AbstractFeatureFlagService) {
    this.featureFlagService.bindEnabled(this.totalRewardsRadialTextCountersFeatureFlag, this.unsubscribe$);
  }

  ngOnInit(): void {
    this.isInEditState = false;
    this.isEditable = this.inEditMode !== false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.inEditMode) {
      this.isEditable = this.inEditMode;
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
  }

  get displayRadialTextCounter(): boolean {
    return this.totalRewardsRadialTextCountersFeatureFlag.value && this.isInEditState && this.showRadialTextCounter;
  }

  getValueForInputControl(): string {
    if (this.value) {
      return this.value;
    } else if (this.isIe()) {
      return this.getValueForDisplay();
    } else {
      return '';
    }
  }

  getValueForDisplay(): string {
    return this.value?.length > 0 ? this.value : this.placeholder;
  }

  getHoverText(): string {
    return this.showHoverText ? this.getValueForInputControl() : '';
  }

  enableEditState(): void {
    this.isInEditState = true;
    this.availableWidth = this.editAnchor?.nativeElement.clientWidth;
    setTimeout(() => this.textBox.nativeElement.focus(), 0);
  }

  disableEditState(): void {
    this.isInEditState = false;
  }

  onFocus(): void {
    this.contentWidth = this.value?.length > 0 ? this.editText?.nativeElement.clientWidth : 0;
  }

  onChange(): void {
    this.value = this.textBox.nativeElement.value;
    this.valueChange.emit(this.value);
  }

  onKeyDown(event: KeyboardEvent) {
    if (!(event.key === 'Backspace' || event.key === 'Delete')
      && this.totalRewardsRadialTextCountersFeatureFlag.value && this.contentWidth >= this.availableWidth) {
      event.preventDefault();
    }
  }

  onKeyUp(event: any) {
    this.editText.nativeElement.innerHTML = this.textBox.nativeElement.value;
    this.contentWidth = this.editText.nativeElement.clientWidth;
  }

  isIe(): boolean {
    const agent = window.navigator.userAgent.toLowerCase();
    return agent.indexOf('trident') > -1;
  }
}
