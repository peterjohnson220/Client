import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {take} from 'rxjs/operators';
import {Observable} from 'rxjs';

import { ClientServerFilterHelper } from '../../helpers';
import { Filter, FilterType, isFilterableMultiFilter, isMultiFilter, isRangeFilter, isTextFilter } from '../../models';
import { OperatorEnum } from '../../../../../constants';
import {FeatureAreaConstants, UiPersistenceSettingConstants} from '../../../../../models/common';
import {SettingsService} from '../../../../../state/app-context/services';

@Component({
  selector: 'pf-filter-section',
  templateUrl: './filter-section.component.html',
  styleUrls: ['./filter-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterSectionComponent implements OnInit {
  @Input() filter: Filter;
  @Input() singled: boolean;
  @Input() overriddenSelectionCount: number;
  @Input() searchValue: string;
  @Input() additionalTitle?: string;
  @Output() clear: EventEmitter<string> = new EventEmitter();
  @Output() search: EventEmitter<Filter> = new EventEmitter();
  @Output() showMore: EventEmitter<Filter> = new EventEmitter();
  @Output() showLess: EventEmitter<Filter> = new EventEmitter();
  @Output() searchValueChanged: EventEmitter<string> = new EventEmitter();

  protected cssReplacementRegex = /[\s]/g;
  collapsed: boolean;
  filterTypes = FilterType;
  maxOptions = ClientServerFilterHelper.defaultNumberOfOptions;
  persistedCollapsedSetting$: Observable<boolean>;
  persistedCollapsedSetting?: boolean;

  constructor(private settingsService: SettingsService) {}

  ngOnInit(): void {
    this.persistedCollapsedSetting$ = this.settingsService.selectUiPersistenceSettingFromDictionary(
      FeatureAreaConstants.PeerManageFilters,
      UiPersistenceSettingConstants.PeerDefaultCollapsedFilters,
      this.filter.BackingField);

    this.persistedCollapsedSetting$.pipe(take(1)).subscribe(collapsed => this.persistedCollapsedSetting = collapsed);

      this.collapsed = typeof(this.persistedCollapsedSetting) === 'boolean' ?
        !this.singled && this.persistedCollapsedSetting :
        !this.singled && this.filter.IsCollapsedByDefault;

  }

  get filterOperatorLabel(): string {
    const operator = this.filter.Operator;
    if (operator !== null && !!OperatorEnum[operator]) {
      return ' (' + OperatorEnum[operator].toUpperCase() + ')';
    }

    return null;
  }

  get cssResetClearBtnAutomationName(): string {
    const filterCssClassName = this.filter.CssClassName.toLowerCase().replace(this.cssReplacementRegex, '-');
    return 'au-btn-clear-' + filterCssClassName;
  }

  get shouldShowClearLink(): boolean {
    return (this.selectionCount > 0 || this.hasText || this.rangeHasSelection) && !this.filter.Locked;
  }

  get selectionCount(): number {
    return this.overriddenSelectionCount ||
      (isMultiFilter(this.filter) || isFilterableMultiFilter(this.filter) ? this.filter.Options.filter(o => o.Selected).length : 0);
  }

  get selectableOptionCount(): number {
    return (isMultiFilter(this.filter) || isFilterableMultiFilter(this.filter)) ? this.filter.Options.filter(o => o.Count > 0).length : 0;
  }

  get optionCount(): number {
    return (isMultiFilter(this.filter) || isFilterableMultiFilter(this.filter)) ? this.filter.Options.length : 0;
  }

  get hasText(): boolean {
    return isTextFilter(this.filter) ? this.filter.Value.length > 0 : false;
  }

  get rangeHasSelection(): boolean {
    return isRangeFilter(this.filter) ? this.filter.SelectedMinValue > 0 || this.filter.SelectedMaxValue > 0 : false;
  }

  get isRangeFilter(): boolean {
    return isRangeFilter(this.filter);
  }

  get isMultiFilter(): boolean {
    return isMultiFilter(this.filter);
  }

  get allowedToSearch(): boolean {
    return (this.filter.Type === this.filterTypes.Multi || this.filter.Type === this.filterTypes.FilterableMulti) &&
            !this.singled &&
            this.selectableOptionCount >= this.maxOptions &&
            !this.filter.Locked;
  }

  get showAllOptions(): boolean {
    return (isMultiFilter(this.filter) || isFilterableMultiFilter(this.filter)) && this.filter.ShowAllOptions;
  }

  get displayShowMore(): boolean {
    return this.optionCount >= this.maxOptions && !this.singled && !this.showAllOptions;
  }

  get disableShowMore(): boolean {
    return (isMultiFilter(this.filter) || isFilterableMultiFilter(this.filter)) && this.optionCount + this.selectionCount < this.filter.AggregateCount;
  }

  get displayShowLess(): boolean {
    return (isMultiFilter(this.filter) || isFilterableMultiFilter(this.filter)) && this.filter.AggregateCount != null && this.filter.AggregateCount !== 5;
  }

  toggle(updatePersistenceSettings = true) {
    if (!this.singled) {
      this.collapsed = !this.collapsed;

      if (updatePersistenceSettings) {
        this.settingsService.updateUiPersistenceSettingDictionary(
          FeatureAreaConstants.PeerManageFilters,
          UiPersistenceSettingConstants.PeerDefaultCollapsedFilters,
          this.filter.BackingField,
          this.collapsed
        );
      }
    }
  }

  handleClearClicked(e, filterId: string) {
    e.stopPropagation();
    this.clear.emit(filterId);
  }

  handleSearchClicked(e, filter: Filter) {
    e.stopPropagation();
    this.search.emit(filter);
  }

  handleShowMoreClicked(filter: Filter) {
    if (this.allowedToSearch && !this.disableShowMore) {
      this.showMore.emit(filter);
    }
  }

  handleShowLessClicked(filter: Filter) {
    if (this.allowedToSearch) {
      this.showLess.emit(filter);
    }
  }

  handleSearchValueChanged(value: string) {
    this.searchValueChanged.emit(value);
  }
}
