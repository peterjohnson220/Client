import { CompensableFactorModel } from 'libs/models/comphub';

export function generateDefaultYearsExperience(): CompensableFactorModel[] {
  return [
    { Name: 'Any', Data: null, Selected: false },
    { Name: '0', Data: null, Selected: false },
    { Name: '1', Data: null, Selected: false },
    { Name: '2', Data: null, Selected: false },
    { Name: '3', Data: null, Selected: false },
    { Name: '4', Data: null, Selected: false },
    { Name: '5', Data: null, Selected: false },
    { Name: '6', Data: null, Selected: false },
    { Name: '7', Data: null, Selected: false },
    { Name: '8', Data: null, Selected: false },
    { Name: '9', Data: null, Selected: false },
    { Name: '10', Data: null, Selected: false },
    { Name: '11', Data: null, Selected: false },
    { Name: '12', Data: null, Selected: false },
    { Name: '13', Data: null, Selected: false },
    { Name: '14', Data: null, Selected: false },
    { Name: '15', Data: null, Selected: false },
    { Name: '16', Data: null, Selected: false },
    { Name: '17', Data: null, Selected: false },
    { Name: '18', Data: null, Selected: false },
    { Name: '19', Data: null, Selected: false },
    { Name: '20', Data: null, Selected: false },
    { Name: '21', Data: null, Selected: false },
    { Name: '22', Data: null, Selected: false },
    { Name: '23', Data: null, Selected: false },
    { Name: '24', Data: null, Selected: false },
    { Name: '25', Data: null, Selected: false }
  ];
}

export function generateDefaultEducationTypes(): CompensableFactorModel[] {
  return [
    { Name: 'Any', Data: null, Selected: false }
  ];
}

export function generateDefaultSupervisorRole(): CompensableFactorModel[] {
  return [
    { Name: 'Any', Data: null, Selected: false },
    { Name: 'No', Data: null, Selected: false },
    { Name: 'Yes', Data: null, Selected: false }
  ];
}
