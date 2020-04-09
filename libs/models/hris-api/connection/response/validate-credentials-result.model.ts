export interface ValidateCredentialsResponse {
  successful: boolean;
  skipValidation: boolean;
  errors: string[];
}

export function generateMockValidValidateCredentialsResponse(): ValidateCredentialsResponse {
  return {
    successful: true,
    skipValidation: true,
    errors: []
  };
}

export function generateMockValidLongRunningValidateCredentialsResponse(): ValidateCredentialsResponse {
  return {
    successful: true,
    skipValidation: true,
    errors: []
  };
}

export function generateMockInvalidValidateCredentialsResponse(): ValidateCredentialsResponse {
  return {
    successful: false,
    skipValidation: true,
    errors: [
      'MockError1',
      'MockError2'
    ]
  };
}
