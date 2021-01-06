import { Component, Input, Output, EventEmitter, HostListener, OnInit, OnDestroy } from '@angular/core';

import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { UpdateSettingsColorRequest } from 'libs/features/total-rewards/total-rewards-statement/models';
import { FontFamily, FontSize } from 'libs/features/total-rewards/total-rewards-statement/types';

import { environment } from 'environments/environment';

@Component({
  selector: 'pf-settings-panel',
  templateUrl: './settings-panel.component.html',
  styleUrls: ['./settings-panel.component.scss']
})
export class SettingsPanelComponent implements OnInit, OnDestroy {

  @Input() isOpen: boolean;
  @Input() fontFamily: FontFamily;
  @Input() fontSize: FontSize;
  @Input() colors: string[];
  @Input() isSavingError: boolean;

  @Output() close = new EventEmitter();
  @Output() fontSizeChange = new EventEmitter<FontSize>();
  @Output() fontFamilyChange = new EventEmitter<FontFamily>();
  @Output() colorChange = new EventEmitter<UpdateSettingsColorRequest>();
  @Output() resetSettings = new EventEmitter();

  colorSubject = new Subject<UpdateSettingsColorRequest>();
  colorSubjectSubscription = new Subscription();

  showFontFamilyMenu = environment.enableTrsCustomFontFamilies;

  ngOnInit() {
    // debounce chart color changes which can fire rapidly when click + hold, then dragging
    this.colorSubjectSubscription = this.colorSubject.pipe(
      distinctUntilChanged(),
      debounceTime(400)
    ).subscribe((request: UpdateSettingsColorRequest) => this.colorChange.emit(request));
  }

  ngOnDestroy() {
    this.colorSubjectSubscription.unsubscribe();
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

  onColorChange(color: string, colorIndex: number) {
    this.colorSubject.next({ Color: color, ColorIndex: colorIndex });
  }

  onResetSettings() {
    this.resetSettings.emit();
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.isOpen && (event.key.toLowerCase() === 'escape' || event.key.toLowerCase() === 'esc')) {
      this.close.emit();
    }
  }
}
