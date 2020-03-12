import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { StoreModule } from '@ngrx/store';

import { generateMockCompanyJob } from 'libs/models/company/company-job.model';
import { JobDescriptionParserPipe } from 'libs/core/pipes';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import * as fromFaIcons from 'libs/core/fa-icons';
import { SettingsService } from 'libs/state/app-context/services';
import * as fromRootState from 'libs/state/state';

import { CompanyJobDetailComponent } from './company-job-detail.component';

describe('CompanyJobDetailComponent', () => {
  let component: CompanyJobDetailComponent;
  let fixture: ComponentFixture<CompanyJobDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers
        }),
        FontAwesomeModule
      ],
      declarations: [CompanyJobDetailComponent, JobDescriptionParserPipe],
      // Shallow Testing
      schemas: [NO_ERRORS_SCHEMA],
      providers: [SettingsService],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyJobDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the selected company jobs props', () => {
    component.jdmDescriptionIds = [];
    component.selectedCompanyJob = generateMockCompanyJob();

    // set JobDescription to blank to avoid the parser from executing and throwing errors
    component.selectedCompanyJob.JobDescription = '';

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show a link to download the jdm description via the `show` class when one jdm description id exists', () => {
    component.jdmDescriptionIds = [123456];
    component.selectedCompanyJob = generateMockCompanyJob();

    // set JobDescription to blank to avoid the parser from executing and throwing errors
    component.selectedCompanyJob.JobDescription = '';

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should hide a link to download the jdm description via omitting the `show` class when no jdm descriptions exists', () => {
    component.jdmDescriptionIds = [];
    component.selectedCompanyJob = generateMockCompanyJob();

    // set JobDescription to blank to avoid the parser from executing and throwing errors
    component.selectedCompanyJob.JobDescription = '';

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show an informational message when multiple jdm ids exist', () => {
    component.jdmDescriptionIds = [123, 456];
    component.selectedCompanyJob = generateMockCompanyJob();

    // set JobDescription to blank to avoid the parser from executing and throwing errors
    component.selectedCompanyJob.JobDescription = '';

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show a spinner when downloading a jdm description', () => {
    component.jdmDescriptionIds = [123];
    component.jdmDescriptionLoading = true;
    component.selectedCompanyJob = generateMockCompanyJob();

    // set JobDescription to blank to avoid the parser from executing and throwing errors
    component.selectedCompanyJob.JobDescription = '';

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show an error message if the jdm description download fails', () => {
    component.jdmDescriptionIds = [123];
    component.jdmDescriptionLoading = false;
    component.jdmDescriptionLoadingError = true;
    component.selectedCompanyJob = generateMockCompanyJob();

    // set JobDescription to blank to avoid the parser from executing and throwing errors
    component.selectedCompanyJob.JobDescription = '';

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should emit when the view full job description link is clicked', () => {
    spyOn(component.viewJdmDescriptionClick, 'emit');

    component.jdmDescriptionIds = [123];
    component.jdmDescriptionLoading = false;
    component.jdmDescriptionLoadingError = false;
    component.selectedCompanyJob = generateMockCompanyJob();

    // set JobDescription to blank to avoid the parser from executing and throwing errors
    component.selectedCompanyJob.JobDescription = '';

    fixture.detectChanges();

    const viewFullJobDescription = fixture.debugElement.nativeElement.querySelector('a.jdm');
    viewFullJobDescription.click();

    expect(component.viewJdmDescriptionClick.emit).toHaveBeenCalled();
  });
});
