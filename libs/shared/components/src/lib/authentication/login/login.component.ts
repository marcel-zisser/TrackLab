import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticationService } from '@tracklab/services';
import { first } from 'rxjs';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { RegisterComponent } from '../register/register.component';
import { Password } from 'primeng/password';
import { Message } from 'primeng/message';

@Component({
  selector: 'tl-login',
  imports: [Button, InputText, ReactiveFormsModule, Password, Message],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly authenticationService = inject(AuthenticationService);
  private readonly dialogService = inject(DialogService);

  loginForm: FormGroup;
  loginFailed = signal(false);

  constructor(private fb: FormBuilder, private ref: DynamicDialogRef) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  protected onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.loginForm.disable();

      this.authenticationService
        .login(email, password)
        .pipe(first())
        .subscribe({
          next: (response) => {
            this.loginFailed.set(false);
            this.authenticationService.saveToken(response.accessToken);
            this.ref.close();
          },
          error: () => {
            this.loginFailed.set(true);
            this.loginForm.reset();
            this.markFormAsInvalid();
            this.loginForm.enable();
          },
        });
    } else {
      this.markFormAsInvalid();
    }
  }

  protected openRegistration() {
    this.ref.close();

    this.dialogService.open(RegisterComponent, {
      header: 'Register',
      closable: true,
      modal: true
    });
  }

  protected closeDialog() {
    this.ref.close();
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
