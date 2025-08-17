import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthenticationService } from '@tracklab/services';
import { first } from 'rxjs';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { RegisterComponent } from '../register/register.component';
import { Password } from 'primeng/password';
import { Message } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { AutoFocus } from 'primeng/autofocus';

@Component({
  selector: 'tl-login',
  imports: [
    Button,
    InputText,
    ReactiveFormsModule,
    Password,
    Message,
    AutoFocus,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private ref = inject(DynamicDialogRef);

  private readonly authenticationService = inject(AuthenticationService);
  private readonly dialogService = inject(DialogService);
  private readonly messageService = inject(MessageService);

  loginForm: FormGroup;
  loginFailed = signal(false);

  constructor() {
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
          next: async (response) => {
            this.loginFailed.set(false);
            this.authenticationService.saveToken(response.accessToken);

            const decodedToken =
              await this.authenticationService.getDecodedToken();
            this.messageService.add({
              severity: 'success',
              summary: 'Login successful',
              detail: `Welcome back, ${decodedToken?.firstName}!`,
            });
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
      modal: true,
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
      control?.setErrors({ wrongCredentials: true });
    });
  }
}
