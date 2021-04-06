import { StructureRangeGroupGradesResponse, StructureRangeGroupGradeJobsResponse, SaveCompanyJobStructureMapsRequest } from 'libs/models/payfactors-api';

import { AddRemoveCompanyJobStructureMapModel, Grade, GradeJob, GradeJobs } from '../models';
import { JobResult } from '../../../jobs/add-jobs/models';

export class PayfactorsApiModelMapper {

  ///
  /// IN
  ///

  static mapGradesResponseToGrades(srggr: StructureRangeGroupGradesResponse[], rangeGroupId: number): Grade[] {
    // the last entry is a total that we don't care about in the client implementation
    srggr.pop();
    return srggr.map((g: StructureRangeGroupGradesResponse): Grade => {
      return {
        GradeName: g.Grade_Name,
        CompanyStructuresRangesId: g.CompanyStructuresRanges_ID,
        CompanyStructuresGradesId: g.CompanyStructuresGrades_ID,
        Min: g.Min,
        Mid: g.Mid,
        Max: g.Max,
        Tertile_First: g.Tertile_First,
        Tertile_Second: g.Tertile_Second,
        Quartile_First: g.Quartile_First,
        Quartile_Second: g.Quartile_Second,
        Quintile_First: g.Quintile_First,
        Quintile_Second: g.Quintile_Second,
        Quintile_Third: g.Quintile_Third,
        Quintile_Fourth: g.Quintile_Fourth,
        LoadingJobs: false,
        LoadingJobsError: false,
        Jobs: [],
        TotalJobs: g.NumJobs,
        CompanyStructuresRangeGroupId: rangeGroupId,
        JobIdsToRemove: [],
        JobIdsToAdd: []
      };
    });
  }

  static mapGradeJobsResponseToGradeJobs(gjs: StructureRangeGroupGradeJobsResponse[], gradeId: number): GradeJobs {
    const gradeJobs = gjs.map((gj: StructureRangeGroupGradeJobsResponse): GradeJob => {
      return {
        JobCode: gj.JobCode,
        JobTitle: gj.JobTitle,
        CompanyStructuresGradesId: gradeId,
        JobId: gj.CompanyJobId,
        AlreadyExists: true
      };
    });
    return { CompanyStructuresGradesId: gradeId, GradeJobs: gradeJobs };
  }

  static mapJobResultsToGradeJobs(jrs: JobResult[], gradeId: number): GradeJobs {
    const gradeJobs = jrs.map((jr: JobResult): GradeJob => {
      return {
        JobId: parseInt(jr.Id, 10),
        JobTitle: jr.Title,
        JobCode: jr.Code,
        CompanyStructuresGradesId: gradeId,
        AlreadyExists: false
      };
    });
    return { CompanyStructuresGradesId: gradeId, GradeJobs: gradeJobs };
  }

  ///
  /// OUT
  ///

  static mapGradesToSaveCompanyJobStructureMapsRequest(grades: Grade[]): SaveCompanyJobStructureMapsRequest {
    const gradesToUpdate = grades.map((g: Grade): AddRemoveCompanyJobStructureMapModel => {
      return {
        StructuresGradesId: g.CompanyStructuresGradesId,
        CompanyJobIdsToAdd: g.JobIdsToAdd,
        CompanyJobIdsToRemove: g.JobIdsToRemove
      };
    });
    return { GradesToUpdate: gradesToUpdate, StructuresRangeGroupId: grades[0].CompanyStructuresRangeGroupId };
  }

}
