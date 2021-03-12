import { StructureRangeGroupGradesResponse, StructureRangeGroupGradeJobsResponse } from 'libs/models/payfactors-api';

import { Grade, GradeJob, GradeJobs } from '../models';

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
        CompanyStructuresRangeGroupId: rangeGroupId
      };
    });
  }

  static mapGradeJobsResponseToGradeJobs(gjs: StructureRangeGroupGradeJobsResponse[], gradeId: number): GradeJobs {
    const gradeJobs = gjs.map((gj: StructureRangeGroupGradeJobsResponse): GradeJob => {
      return {
        JobCode: gj.JobCode,
        JobTitle: gj.JobTitle,
        CompanyStructuresGradesId: gradeId
      };
    });
    return { CompanyStructuresGradesId: gradeId, GradeJobs: gradeJobs };
  }

}
