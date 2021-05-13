import { Component, Input, Output, EventEmitter, HostListener, OnInit, OnDestroy } from '@angular/core';

import { Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { AbstractFeatureFlagService, FeatureFlags, RealTimeFlag } from 'libs/core/services/feature-flags';
import { BrowserDetectionService } from 'libs/core/services';
import {
  UpdateSettingsColorRequest,
  StatementDisplaySettings,
  StatementDisplaySettingsEnum,
  StatementAdditionalPageSettings,
  StatementAdditionalPagePlacementEnum
} from 'libs/features/total-rewards/total-rewards-statement/models';
import { FontFamily, FontSize } from 'libs/features/total-rewards/total-rewards-statement/types';
import { AppConstants } from 'libs/constants';

@Component({
  selector: 'pf-settings-panel',
  templateUrl: './settings-panel.component.html',
  styleUrls: ['./settings-panel.component.scss']
})
export class SettingsPanelComponent implements OnInit, OnDestroy {

  @Input() isOpen$: Observable<boolean>;
  @Input() fontFamily: FontFamily;
  @Input() fontSize: FontSize;
  @Input() colors: string[];
  @Input() displaySettings: StatementDisplaySettings;
  @Input() isSavingError: boolean;
  @Input() additionalPageSettings: StatementAdditionalPageSettings;

  @Output() close = new EventEmitter();
  @Output() fontSizeChange = new EventEmitter<FontSize>();
  @Output() fontFamilyChange = new EventEmitter<FontFamily>();
  @Output() colorChange = new EventEmitter<UpdateSettingsColorRequest>();
  @Output() displaySettingChange = new EventEmitter<StatementDisplaySettingsEnum>();
  @Output() additionalPageSettingChange = new EventEmitter<StatementAdditionalPageSettings>();
  @Output() resetSettings = new EventEmitter();

  displaySettingsEnum = StatementDisplaySettingsEnum;
  additionalPagePlacementEnum = StatementAdditionalPagePlacementEnum;

  additionalPagePlacementOptions = [
    {value: StatementAdditionalPagePlacementEnum.None, text: 'None'},
    {value: StatementAdditionalPagePlacementEnum.BeforeStatement, text: 'Before Statement'},
    {value: StatementAdditionalPagePlacementEnum.AfterStatement, text: 'After Statement'}
  ];

  focusedTab: 'Style' | 'Content';
  isOpen: boolean;
  isOpenSubscription = new Subscription();
  colorSubject = new Subject<UpdateSettingsColorRequest>();
  colorSubjectSubscription = new Subscription();

  showFontFamilyMenu = AppConstants.EnableTrsCustomFontFamilies;
  cpUseRootViewContainer = false;
  totalRewardsEmployeeContributionFeatureFlag: RealTimeFlag = { key: FeatureFlags.TotalRewardsEmployeeContribution, value: false };
  totalRewardsAdditionalPageFeatureFlag: RealTimeFlag = { key: FeatureFlags.TotalRewardsAdditionalPage, value: false };
  unsubscribe$ = new Subject<void>();
  delay = ms => new Promise(res => setTimeout(res, ms));

  constructor(private featureFlagService: AbstractFeatureFlagService, private browserDetectionService: BrowserDetectionService) {
    this.featureFlagService.bindEnabled(this.totalRewardsEmployeeContributionFeatureFlag, this.unsubscribe$);
    this.featureFlagService.bindEnabled(this.totalRewardsAdditionalPageFeatureFlag, this.unsubscribe$);
  }

  ngOnInit() {
    // debounce chart color changes which can fire rapidly when click + hold, then dragging
    this.colorSubjectSubscription = this.colorSubject.pipe(
      distinctUntilChanged(),
      debounceTime(400)
    ).subscribe((request: UpdateSettingsColorRequest) => this.colorChange.emit(request));

    this.isOpenSubscription = this.isOpen$.subscribe(isOpen => {
      this.isOpen = isOpen;
      if (!this.isOpen) {
        this.delay(300).then(() => {
          this.focusedTab = 'Style';
        });
      }
    });

    if (this.browserDetectionService.checkBrowserIsIE()) {
      this.cpUseRootViewContainer = true;
    }
  }

  ngOnDestroy() {
    this.colorSubjectSubscription.unsubscribe();
    this.isOpenSubscription.unsubscribe();
    this.unsubscribe$.next();
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

  onDisplaySettingChange(displaySettingKey: StatementDisplaySettingsEnum) {
    this.displaySettingChange.emit(displaySettingKey);
  }

  onAdditionalPagePlacementSettingChange(pagePlacement: StatementAdditionalPagePlacementEnum) {
    const additionalPageSettings = this.createAdditionalPageSettingsEventArg();
    additionalPageSettings.PagePlacement = pagePlacement;
    this.additionalPageSettingChange.emit(additionalPageSettings);
  }

  onAdditionalPageHeaderSettingChange() {
    const additionalPageSettings = this.createAdditionalPageSettingsEventArg();
    additionalPageSettings.ShowStatementHeader = !this.additionalPageSettings.ShowStatementHeader;
    this.additionalPageSettingChange.emit(additionalPageSettings);
  }

  getSelectedAdditionalPagePlacement() {
    return this.additionalPagePlacementOptions.find(el => el.value === this.additionalPageSettings?.PagePlacement);
  }

  onResetSettings() {
    this.resetSettings.emit();
  }

  onHandleTabClick(tab) {
    this.focusedTab = tab;
  }

  private createAdditionalPageSettingsEventArg(): StatementAdditionalPageSettings {
    return {...this.additionalPageSettings};
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.isOpen && (event.key.toLowerCase() === 'escape' || event.key.toLowerCase() === 'esc')) {
      this.close.emit();
    }
  }
}
