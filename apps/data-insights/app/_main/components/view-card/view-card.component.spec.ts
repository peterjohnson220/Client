import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { ViewCardComponent } from './view-card.component';

describe('Data Insights - View Card Component', () => {
  let instance: ViewCardComponent;
  let fixture: ComponentFixture<ViewCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCardComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(ViewCardComponent);
    instance = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should display overlay when mouse over view container', () => {
    instance.handleMouseOverViewContainer();
    fixture.detectChanges();

    expect(instance.displayActionsOverlay).toEqual(true);
  });

  it('should NOT display overlay when mouse leave view container', () => {
    instance.handleMouseLeaveViewContainer();
    fixture.detectChanges();

    expect(instance.displayActionsOverlay).toEqual(false);
  });

  it('should emit favoriteClicked when clicking on star icon', () => {
    spyOn(instance.favoriteClicked, 'emit');

    instance.handleFavoriteClicked();

    expect(instance.favoriteClicked.emit).toHaveBeenCalledWith({workbookId: instance.workbookId, view: instance.view});
  });

});
