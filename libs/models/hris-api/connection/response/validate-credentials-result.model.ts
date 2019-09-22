export interface ValidateCredentialsResponse {
  successful: boolean;
  errors: string[];
}

export function generateMockValidValidateCredentialsResponse(): ValidateCredentialsResponse {
  return {
    successful: true,
    errors: []
  };
}

export function generateMockInvalidValidateCredentialsResponse(): ValidateCredentialsResponse {
  return {
    successful: false,
    errors: [
      'MockError1',
      'MockError2'
    ]
  };
}
