import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticationService } from '@tracklab/services';
import { first } from 'rxjs';

@Component({
  selector: 'tl-login',
  imports: [CommonModule, Button, InputText, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly authenticationService = inject(AuthenticationService);

  loginForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      this.loginForm.disable();

      this.authenticationService
        .login(username, password)
        .pipe(first())
        .subscribe({
          next: (response) => {
            this.authenticationService.saveToken(response.accessToken);
          },
          error: () => {
            this.loginForm.reset();
            this.markFormAsInvalid();
            this.loginForm.enable();
          },
        });
    }
  }

  private markFormAsInvalid() {
    Object.keys(this.loginForm.controls).forEach((field) => {
      const control = this.loginForm.get(field);
      control?.markAsTouched({ onlySelf: true });
      control?.markAsDirty();
      control?.setErrors({ wrongCredentials: true })
    });
  }
}
