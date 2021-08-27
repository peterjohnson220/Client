import { AfterContentInit, AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { JobData } from 'libs/models/comphub';

import * as fromComphubSharedReducer from '../../../_shared/reducers';
import { CompensableFactorsSummaryModel } from '../../../_crowd-sourced-data/models';
import { PrintConstants } from '../../constants';

@Component({
  selector: 'pf-job-summary-print',
  templateUrl: './job-summary-print.component.html',
  styleUrls: ['./job-summary-print.component.scss']
})
export class JobSummaryPrintComponent implements OnInit, OnDestroy, AfterViewInit {

  selectedJobData$: Observable<JobData>;

  selectedJobDataSub: Subscription;

  selectedJobTitle: string;
  selectedPaymarket: string;
  loadingData: boolean;
  date: string;
  fullRenderComplete = false;
  pageTotal = 5;
  renderCount = 0;
  readyForPdfGenerationSelector = PrintConstants.READY_FOR_PDF_GENERATION_SELECTOR;

  jobData: JobData = {
    JobId: 1234,
    JobCode: 'Test',
    JobTitle: 'Software Engineer',
    JobDescription: 'Develop new products using C#, Angular, SQL, Mongo',
    Education: 'Bachelors Degree',
    YearsOfExperience: '3',
    ManagesEmployees: false,
    Skills: ['Angular', 'C#', 'Javascript'],
    FLSAStatus: '',
    Base10: 50000,
    Base25: 55000,
    Base50: 60000,
    Base75: 70000,
    Base90: 80000,
    Tcc10: 50000,
    Tcc25: 55000,
    Tcc50: 60000,
    Tcc75: 70000,
    Tcc90: 80000,
    ShowJd: false
  };

  compensableFactorData: CompensableFactorsSummaryModel = {
    Location: 'Boston, Massachusetts, USA',
    Industry: 'Technology',
    OrgType: 'Not-for-profit',
    EmployeeCount: 5026,
    GovContractor: 'No',
    YearsExperience: '5-10 years',
    ManagementRole: 'Yes',
    Skills: 'Angular, C#, Javascript',
    Certs: 'Cert 1, Cert 2, Cert3'
  };

  dataSummary = {
    'ProductBusiness': [
        {
          Answer: 'Information Technology (IT) Services',
          PercentMatch: 9
        },
        {
          Answer: 'Manufacturing Construction',
          PercentMatch: 9
        },
        {
          Answer: 'Saas Development',
          PercentMatch: 9
        },
        {
          Answer: 'Software Development',
          PercentMatch: 9
        },
        {
          Answer: 'Construction Management and Equipment Rental or Leasing',
          PercentMatch: 9
        },
        {
          Answer: 'Consulting',
          PercentMatch: 9
        },
        {
          Answer: 'Other',
          PercentMatch: 9
        },
        {
          Answer: 'Unspecified',
          PercentMatch: 9
        }
      ],
    'Types': [
        {
          Answer: 'Company',
          PercentMatch: 9
        },
        {
          Answer: 'Non-Profit Organization',
          PercentMatch: 9
        },
        {
          Answer: 'Other',
          PercentMatch: 9
        },
        {
          Answer: 'Unspecified',
          PercentMatch: 9
        }
      ],
    'DataRanges': [
        {
          Answer: '2020 Q3',
          PercentMatch: 9
        },
        {
          Answer: '2020 Q2',
          PercentMatch: 9
        },
        {
          Answer: '2020 Q1',
          PercentMatch: 9
        },
        {
          Answer: '2019 Q4',
          PercentMatch: 9
        },
        {
          Answer: '2019 Q3',
          PercentMatch: 9
        },
        {
          Answer: '2019 Q2',
          PercentMatch: 9
        },
        {
          Answer: '2019 Q1',
          PercentMatch: 9
        },
        {
          Answer: '2018 Q4',
          PercentMatch: 9
        }
      ],
    'JobTitles': [
        {
          Answer: 'Financial Controller',
          PercentMatch: 9
        },
        {
          Answer: 'Plant Controller',
          PercentMatch: 9
        }
      ],
    'YearsExperience': [
        {
          Answer: '2 to 5 years',
          PercentMatch: 9
        },
        {
          Answer: '2 to 5 years',
          PercentMatch: 9
        },
        {
          Answer: '2 to 5 years',
          PercentMatch: 9
        },
        {
          Answer: '2 to 5 years',
          PercentMatch: 9
        },
        {
          Answer: '2 to 5 years',
          PercentMatch: 9
        },
        {
          Answer: '2 to 5 years',
          PercentMatch: 9
        },
        {
          Answer: '2 to 5 years',
          PercentMatch: 9
        }
      ],
    'OrgSize': [
        {
          Answer: '20 to 29',
          PercentMatch: 9
        },
        {
          Answer: '20 to 29',
          PercentMatch: 9
        },
        {
          Answer: '20 to 29',
          PercentMatch: 9
        },
        {
          Answer: '20 to 29',
          PercentMatch: 9
        },
        {
          Answer: '20 to 29',
          PercentMatch: 9
        },
        {
          Answer: '20 to 29',
          PercentMatch: 9
        },
        {
          Answer: '20 to 29',
          PercentMatch: 9
        },
        {
          Answer: '20 to 29',
          PercentMatch: 9
        },
        {
          Answer: 'Unspecified',
          PercentMatch: 9
        }
      ],
    'Cities': [
        {
          Answer: 'Boston',
          PercentMatch: 9
        },
        {
          Answer: 'Boston',
          PercentMatch: 9
        },
        {
          Answer: 'Boston',
          PercentMatch: 9
        },
        {
          Answer: 'Boston',
          PercentMatch: 9
        },
        {
          Answer: 'Boston',
          PercentMatch: 9
        },
        {
          Answer: 'Boston',
          PercentMatch: 9
        },
        {
          Answer: 'Boston',
          PercentMatch: 9
        },
        {
          Answer: 'Boston',
          PercentMatch: 9
        }
      ]
    };


  constructor(
    private sharedStore: Store<fromComphubSharedReducer.State>,
  ) {
    this.selectedJobData$ = this.sharedStore.select(fromComphubSharedReducer.getSelectedJobData);
  }

  handleRenderComplete(rendered: boolean) {
    if ( rendered ) {
      this.renderCount++;
      if (this.renderCount === this.pageTotal) {
        this.fullRenderComplete = true;
      }
    }
  }

  ngOnInit(): void {
    this.selectedJobTitle = this.jobData.JobTitle;
    this.selectedPaymarket = 'National';
    this.date = '8/19/2021';
    this.loadingData = false;
    this.selectedJobDataSub = this.selectedJobData$.subscribe(data => {
      if (data) {
        this.selectedJobTitle = data.JobTitle;
      }
    });
  }
  ngAfterViewInit(): void {
    if ( this.renderCount === this.pageTotal ) {
      this.fullRenderComplete = true;
    }
  }

  ngOnDestroy(): void {
    this.selectedJobDataSub.unsubscribe();
  }

}
