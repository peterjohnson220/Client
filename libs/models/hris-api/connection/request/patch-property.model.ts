export interface PatchProperty {
  PropertyName: string;
  PropertyValue: any;
}

export function generatMockPatchProperty(propertyName: string, propertyValue: any): PatchProperty {
  return {
    PropertyName: propertyName,
    PropertyValue: propertyValue
  };
}

export function generateMockPatchPropertyList(): PatchProperty[] {
  return [
    generatMockPatchProperty('MockProperty1', 1),
    generatMockPatchProperty('MockProperty2', 'NewMockValue'),
  ];
}
