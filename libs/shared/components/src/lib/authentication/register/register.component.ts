import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { AuthenticationService } from '@tracklab/services';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { first } from 'rxjs';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { matchValuesValidator } from '../match-values.validator';

@Component({
  selector: 'tl-register',
  imports: [ReactiveFormsModule, InputText, Button],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private ref = inject(DynamicDialogRef);

  private readonly authenticationService = inject(AuthenticationService);

  registerForm: FormGroup;

  constructor() {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', []],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      passwordRepeat: ['', [Validators.required]],
    },
      {
        validators: [matchValuesValidator('password', 'passwordRepeat')]
      });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { firstName, lastName, email, password } = this.registerForm.value;

      this.registerForm.disable();

      this.authenticationService
        .register(firstName, lastName, email, password)
        .pipe(first())
        .subscribe({
          next: () => {
            this.ref.close();
          },
          error: () => {
            this.registerForm.reset();
            this.markFormAsInvalid();
            this.registerForm.enable();
          },
        });
    } else {
      this.markFormAsInvalid();
    }
  }

  private markFormAsInvalid() {
    Object.keys(this.registerForm.controls).forEach((field) => {
      const control = this.registerForm.get(field);
      control?.markAsTouched({ onlySelf: true });
      control?.markAsDirty();
      control?.setErrors({ wrongCredentials: true })
    });
  }
}
