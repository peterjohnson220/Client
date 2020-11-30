import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import { ProjectTemplatesComponent } from './project-templates.component';
import * as fromUserSettingsReducer from '../../../reducers';
import * as fromProjectTemplateActions from '../../../actions/project-template.actions';

describe('ProjectTemplatesComponent', () => {
  let instance: ProjectTemplatesComponent;
  let fixture: ComponentFixture<ProjectTemplatesComponent>;
  let store: Store<fromUserSettingsReducer.State>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromUserSettingsReducer.reducers,
          userSettings_main: combineReducers(fromUserSettingsReducer.reducers),
        })
      ],
      declarations: [ ProjectTemplatesComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectTemplatesComponent);
    instance = fixture.componentInstance;

    store = TestBed.inject(Store);
    fixture.detectChanges();
  });

  it('should dispatch a delete when delete is confirmed', () => {
    spyOn(instance.store, 'dispatch');
    instance.selectedTemplate = {ProjectTemplateId : 1, TemplateName: 'Test'};
    const expectedAction = new fromProjectTemplateActions.DeleteProjectTemplate(1);

    instance.handleDeleteConfirmed();

    expect(instance.store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should not dispatch a delete when delete is confirmed but no template selected', () => {
    spyOn(instance.store, 'dispatch');
    instance.selectedTemplate = null;
    const expectedAction = new fromProjectTemplateActions.DeleteProjectTemplate(1);

    instance.handleDeleteConfirmed();

    expect(instance.store.dispatch).not.toHaveBeenCalledWith(expectedAction);
  });
});