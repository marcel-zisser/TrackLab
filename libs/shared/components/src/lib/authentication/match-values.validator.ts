import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function matchValuesValidator(controlName: string, matchingControlName: string): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const control = formGroup.get(controlName);
    const matchingControl = formGroup.get(matchingControlName);

    if (!control || !matchingControl) {
      console.error(`Controls with names "${controlName}" or "${matchingControlName}" were not found in the form group.`);
      return null; // Can't validate if controls are not found
    }

    const isMatch = control.value === matchingControl.value;

    // If they don't match, set the error on the matchingControl
    if (!isMatch) {
      matchingControl.setErrors({ matchValues: true });
      return { matchValues: true }; // Return error for form group
    } else {
      // If matching control already has this error, clear it
      if (matchingControl.errors && matchingControl.errors['matchValues']) {
        delete matchingControl.errors['matchValues'];
        if (!Object.keys(matchingControl.errors).length) {
          matchingControl.setErrors(null);
        }
      }
      return null; // No error
    }
  };
}
