import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { of } from 'rxjs';
import { StoreModule } from '@ngrx/store';

import { JobDescriptionParserPipe } from 'libs/core/pipes';
import { SettingsService } from 'libs/state/app-context/services';
import * as fromRootState from 'libs/state/state';

import { GridDetailPanelComponent } from './grid-detail-panel.component';

describe('GridDetailPanelComponent', () => {
  let component: GridDetailPanelComponent;
  let fixture: ComponentFixture<GridDetailPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers
        })
      ],
      declarations: [ GridDetailPanelComponent, JobDescriptionParserPipe ],
      // Shallow Testing
      schemas: [NO_ERRORS_SCHEMA],
      providers: [SettingsService],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridDetailPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render input props', () => {
    component.jobId = 123;
    component.jobCode = 'jobCode';
    component.jobFamily = 'jobFamily';
    component.jobDescription = 'jobDescription';
    component.jobExchange = 'jobExchange';

    expect(fixture).toMatchSnapshot();
  });

  it('should render a falsy job family as No Family', () => {
    component.jobFamily = '';
    expect(fixture).toMatchSnapshot();
  });

  it('should emit when the close link is clicked', () => {
    spyOn(component.closeClick, 'emit');

    component.isExpanded$ = of(true);

    const clearSelections = fixture.debugElement.nativeElement.querySelector('a.close-detail');
    clearSelections.click();

    expect(component.closeClick.emit).toHaveBeenCalled();
  });

  it('should not render jdm controls when checkForJdmDescription is false', () => {
    component.isExpanded$ = of(true);
    component.checkForJdmDescription = false;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show a link to download the jdm description via the `show` class when one jdm description id exists', () => {
    component.isExpanded$ = of(true);
    component.jdmDescriptionIds = [123456];
    component.checkForJdmDescription = true;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should hide a link to download the jdm description via omitting the `show` class when no jdm descriptions exists', () => {
    component.isExpanded$ = of(true);
    component.jdmDescriptionIds = [];
    component.checkForJdmDescription = true;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show an informational message when multiple jdm ids exist', () => {
    component.isExpanded$ = of(true);
    component.jdmDescriptionIds = [123, 456];
    component.checkForJdmDescription = true;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show a spinner when downloading a jdm description', () => {
    component.isExpanded$ = of(true);
    component.jdmDescriptionIds = [123];
    component.jdmDescriptionLoading = true;
    component.checkForJdmDescription = true;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show an error message if the jdm description download fails', () => {
    component.isExpanded$ = of(true);
    component.jdmDescriptionIds = [123];
    component.jdmDescriptionLoading = false;
    component.jdmDescriptionLoadingError = true;
    component.checkForJdmDescription = true;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should emit when the view full job description link is clicked', () => {
    spyOn(component.viewJdmDescriptionClick, 'emit');

    component.isExpanded$ = of(true);
    component.jdmDescriptionIds = [123];
    component.jdmDescriptionLoading = false;
    component.jdmDescriptionLoadingError = false;
    component.checkForJdmDescription = true;

    fixture.detectChanges();

    const viewFullJobDescription = fixture.debugElement.nativeElement.querySelector('a.jdm-description');
    viewFullJobDescription.click();

    expect(component.viewJdmDescriptionClick.emit).toHaveBeenCalled();
  });
});
