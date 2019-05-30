import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';

import { TagInformation, TagInformationRequest, Tag, SaveTagInformationRequest, TagEntityTypeEnum } from 'libs/models/peer';

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

  getCategoriesToShow() {
    if (!this.viewMore && this.showViewMoreLink) {
      return this.priorityCategories;
    }
    return this.priorityCategories.concat(this.regularCategories);
  }

  getSelectedTags(tagArray: Tag[]) {
    return tagArray.filter(ta => ta.Selected);
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
      } else if (!val.Selected) {
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
      this.tagInformation = information;
      this.regularCategories = information.filter(i => i.IsCategoryInExchange !== true);
      this.priorityCategories = information.filter(i => i.IsCategoryInExchange !== false);
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
}
