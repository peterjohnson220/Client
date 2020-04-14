import { Component, Input, Output, EventEmitter, HostListener, OnInit, OnDestroy } from '@angular/core';

import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { UpdateSettingsChartColorRequest } from '../../../../shared/models';
import { FontFamily, FontSize } from '../../../../shared/types';

@Component({
  selector: 'pf-settings-panel',
  templateUrl: './settings-panel.component.html',
  styleUrls: ['./settings-panel.component.scss']
})
export class SettingsPanelComponent implements OnInit, OnDestroy {

  @Input() isOpen: boolean;
  @Input() fontFamily: FontFamily;
  @Input() fontSize: FontSize;
  @Input() chartColors: string[];
  @Input() isSavingError: boolean;

  @Output() close = new EventEmitter();
  @Output() fontSizeChange = new EventEmitter<FontSize>();
  @Output() fontFamilyChange = new EventEmitter<FontFamily>();
  @Output() chartColorChange = new EventEmitter<UpdateSettingsChartColorRequest>();
  @Output() resetSettings = new EventEmitter();

  chartColorSubject = new Subject<UpdateSettingsChartColorRequest>();
  chartColorSubjectSubscription = new Subscription();

  ngOnInit() {
    // debounce chart color changes which can fire rapidly when click + hold, then dragging
    this.chartColorSubjectSubscription = this.chartColorSubject.pipe(
      distinctUntilChanged(),
      debounceTime(400)
    ).subscribe((request: UpdateSettingsChartColorRequest) => this.chartColorChange.emit(request));
  }

  ngOnDestroy() {
    this.chartColorSubjectSubscription.unsubscribe();
  }

  onCloseClick() {
    this.close.emit();
  }

  onFontSizeChange(fontSize: FontSize) {
    this.fontSizeChange.emit(fontSize);
  }

  onFontFamilyChange(fontFamily: FontFamily) {
    this.fontFamilyChange.emit(fontFamily);
  }

  onChartColorChange(color: string, colorIndex: number) {
    this.chartColorSubject.next({ Color: color, ColorIndex: colorIndex });
  }

  onResetSettings() {
    this.resetSettings.emit();
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.isOpen && event.key.toLowerCase() === 'escape') {
      this.close.emit();
    }
  }
}
