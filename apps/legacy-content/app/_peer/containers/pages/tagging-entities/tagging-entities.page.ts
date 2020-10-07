import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import cloneDeep from 'lodash/cloneDeep';

import { TagInformation, TagInformationRequest, Tag, SaveTagInformationRequest, TagEntityTypeEnum, TagCategoryDataTypeEnum } from 'libs/models/peer';
import {RegexStrings, KeyboardKeys} from 'libs/constants';

import * as fromTaggingEntitiesActions from '../../../actions/tagging-entities.actions';
import * as fromTaggingEntitiesReducer from '../../../reducers';

@Component({
  selector: 'pf-tagging-entities',
  templateUrl: './tagging-entities.page.html',
  styleUrls: ['./tagging-entities.page.scss']
})

export class TaggingEntitiesPageComponent implements OnInit, OnDestroy {
  loadingTagInformation$: Observable<boolean>;
  loadingTagInformationError$: Observable<boolean>;
  tagInformation$: Observable<TagInformation[]>;
  saving$: Observable<boolean>;
  addedTags$: Observable<Tag[]>;
  removedTags$: Observable<Tag[]>;

  tagInformationSubscription: Subscription;
  addedTagsSubscription: Subscription;
  removedTagsSubscription: Subscription;

  tagInformation: TagInformation[] = [];
  priorityCategories: TagInformation[] = [];
  regularCategories: TagInformation[] = [];
  addedTags: Tag[] = [];
  removedTags: Tag[] = [];

  viewMore = false;
  showViewMoreLink = true;
  viewMoreLinkText = 'View More';
  saveDisabled = true;

  entityType: TagEntityTypeEnum;
  entityId: number;
  ignoreKeyValidation = false;

  public filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'startsWith'
  };

  constructor(
    private store: Store<fromTaggingEntitiesReducer.State>,
    private route: ActivatedRoute
  ) {
    this.loadingTagInformation$ = store.pipe(select(fromTaggingEntitiesReducer.getTagInformationLoading));
    this.loadingTagInformationError$ = store.pipe(select(fromTaggingEntitiesReducer.getTagInformationLoadingError));
    this.tagInformation$ = store.pipe(select(fromTaggingEntitiesReducer.getTagInformation));
    this.saving$ = store.pipe(select(fromTaggingEntitiesReducer.getSavingTagInformation));
    this.addedTags$ = store.pipe(select(fromTaggingEntitiesReducer.getAddedTags));
    this.removedTags$ = store.pipe(select(fromTaggingEntitiesReducer.getRemovedTags));
    this.entityId = +this.route.snapshot.queryParams.id;
    this.entityType = this.route.snapshot.queryParams.et;
  }

  loadTagInformation() {
    const tagInformationRequest: TagInformationRequest = {
      EntityType: this.entityType,
      EntityId: this.entityId
    };
    this.store.dispatch(new fromTaggingEntitiesActions.LoadTagInformation(tagInformationRequest));
  }

  public itemDisabled(itemArgs: { dataItem: any, index: number }): boolean {
    return itemArgs.dataItem.Selected;
  }

  getCategoriesToShow() {
    if (!this.viewMore && this.showViewMoreLink) {
      return this.priorityCategories;
    }
    return this.priorityCategories.concat(this.regularCategories);
  }

  getSelectedTags(tagArray: Tag[]) {
    return tagArray.filter(ta => ta.Selected);
  }

  sortTagsByValue(tagArray: Tag[]) {
    return  tagArray.sort((a, b) => {
      return a.Value.localeCompare(b.Value); // Use a polyfill for IE support
    });
  }

  public onValueChange(value: any, tagCategoryId: number) {
    if (value.length > 0) {
      const val = value[value.length - 1];
      if (val.Selected === undefined) {
        const newTag: Tag = {
          TagId: 0,
          TagCategoryId: tagCategoryId,
          Value: val,
          Selected: true,
          New: true
        };
        this.store.dispatch(new fromTaggingEntitiesActions.AddTag(newTag));
      } else {
        this.store.dispatch(new fromTaggingEntitiesActions.AddTag(val));
      }
    }
  }

  onRemoveTag(value) {
    this.store.dispatch(new fromTaggingEntitiesActions.RemoveTag(value.dataItem));
  }

  updateViewMore() {
    this.viewMore = !this.viewMore;
    this.viewMoreLinkText = this.viewMore ? 'View Less' : 'View More';
  }

  updateSaveButton() {
    this.saveDisabled = !(this.addedTags.length > 0 || this.removedTags.length > 0);
  }

  saveTagInformation() {
    const saveTagInformationRequest: SaveTagInformationRequest = {
      EntityType: this.entityType,
      EntityId: this.entityId,
      AddedTags: this.addedTags,
      RemovedTags: this.removedTags
    };
    this.store.dispatch(new fromTaggingEntitiesActions.SaveTagInformation(saveTagInformationRequest));
  }

  closeModal() {
    this.store.dispatch(new fromTaggingEntitiesActions.CloseTaggingEntitiesModal());
  }

  ngOnInit(): void {
    this.loadTagInformation();

    this.tagInformationSubscription = this.tagInformation$.subscribe(information => {
      this.tagInformation = cloneDeep(information);
      this.tagInformation.forEach(ti => {
        ti.SelectedTags = this.getSelectedTags(ti.Tags);
        ti.Tags = this.sortTagsByValue(ti.Tags);
      });
      this.regularCategories = this.tagInformation.filter(i => i.IsCategoryInExchange !== true);
      this.priorityCategories = this.tagInformation.filter(i => i.IsCategoryInExchange !== false);
      this.showViewMoreLink = !(this.regularCategories.length === 0 || this.priorityCategories.length === 0);
    });

    this.addedTagsSubscription = this.addedTags$.subscribe(ats => {
      this.addedTags = ats;
      this.updateSaveButton();
    });

    this.removedTagsSubscription = this.removedTags$.subscribe(rts => {
      this.removedTags = rts;
      this.updateSaveButton();
    });
  }

  ngOnDestroy(): void {
    this.tagInformationSubscription.unsubscribe();
    this.addedTagsSubscription.unsubscribe();
    this.removedTagsSubscription.unsubscribe();
  }

  onKeyDown($event: KeyboardEvent, dataType: string) {
    if (dataType === TagCategoryDataTypeEnum.Numeric) {
      this.validateNumeric($event);
    }
  }

  onKeyUp($event: KeyboardEvent) {
    if ($event.key === KeyboardKeys.CONTROL) {
      $event.target['ignoreKeyValidation'] = false;
    }
  }

  onRightClick($event: MouseEvent, dataType: string) {
    if (dataType === TagCategoryDataTypeEnum.Numeric) {
      $event.preventDefault();
    }
  }

  validateNumeric($event: KeyboardEvent) {
    const specialKeys = [
      KeyboardKeys.BACKSPACE,
      KeyboardKeys.TAB,
      KeyboardKeys.HOME,
      KeyboardKeys.END,
      KeyboardKeys.DELETE,
      KeyboardKeys.ARROW_LEFT,
      KeyboardKeys.ARROW_RIGHT,
      KeyboardKeys.ARROW_UP,
      KeyboardKeys.ARROW_DOWN,
    ];

    // if user is holding down control, allow the next key
    if ($event.key === KeyboardKeys.CONTROL) {
      $event.target['ignoreKeyValidation'] = true;
      return;
    }

    // 'v' key excluded explicitly to prevent pasting
    if (specialKeys.findIndex(x => x.toString() === $event.key) !== -1 ||
      ($event.target['ignoreKeyValidation'] && $event.key.toLocaleLowerCase() !== 'v' )) { return ; }

    const previousVal = ($event.target as HTMLTextAreaElement).value.substring(-1);
    const canAddDecimal = previousVal.indexOf('.') === -1;

    if (!this.isValidKey($event.key, canAddDecimal)) {
      $event.preventDefault();
    }
  }

  isValidKey(key: string, canAddDecimal: boolean): boolean {
    return (key.match(RegexStrings.DIGIT) !== null || ((key === KeyboardKeys.PERIOD) && canAddDecimal));
  }
}
