import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { generateMockView } from 'libs/features/surveys/reports/models';

import { FavoriteViewsComponent } from './favorite-views.component';

describe('Data Insights - Favorite Views Component', () => {
  let instance: FavoriteViewsComponent;
  let fixture: ComponentFixture<FavoriteViewsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ FavoriteViewsComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(FavoriteViewsComponent);
    instance = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should emit favoriteClicked with workbookId and view object when handling favorite clicked', () => {
    spyOn(instance.favoriteClicked, 'emit');
    const eventObj = {
      workbookId: '123',
      view: generateMockView()
    };

    instance.handleFavoriteClicked(eventObj);

    expect(instance.favoriteClicked.emit).toHaveBeenCalledWith(eventObj);
  });
});
