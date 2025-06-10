import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '@tracklab/services';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { first } from 'rxjs';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';

@Component({
  selector: 'tl-register',
  imports: [CommonModule, ReactiveFormsModule, InputText, Button],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  private readonly authenticationService = inject(AuthenticationService);

  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private ref: DynamicDialogRef) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      passwordRepeat: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { username, email, password } = this.registerForm.value;

      this.registerForm.disable();

      this.authenticationService
        .register(username, email, password)
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
