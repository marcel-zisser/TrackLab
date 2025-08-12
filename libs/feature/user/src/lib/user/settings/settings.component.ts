import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { Avatar } from 'primeng/avatar';
import { Divider } from 'primeng/divider';
import { AuthenticationService, BackendService } from '@tracklab/services';
import { User } from '@tracklab/models';
import { first } from 'rxjs';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { FileSelectEvent, FileUpload } from 'primeng/fileupload';

@Component({
  selector: 'tl-settings',
  imports: [
    Avatar,
    Divider,
    InputText,
    Button,
    FormsModule,
    ReactiveFormsModule,
    FileUpload,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {
  fileUpload = viewChild.required<FileUpload>('fu');

  private readonly authenticationService = inject(AuthenticationService);
  private readonly backendService = inject(BackendService);
  private readonly fb = inject(FormBuilder);
  private readonly messageService = inject(MessageService);

  protected userGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', Validators.required],
  });
  protected passwordGroup = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', Validators.required],
    newPasswordRepeat: ['', Validators.required],
  });
  protected user = signal<User | undefined>(undefined);
  protected avatar = signal<string | undefined>(undefined);

  constructor() {
    const token = this.authenticationService.getDecodedToken();
    if (token) {
      this.backendService
        .doGet<User>(`user/${token.sub}`)
        .pipe(first())
        .subscribe((user: User | undefined) => {
          this.user.set(user);

          if (user) {
            this.userGroup.get('firstName')?.patchValue(user?.firstName);
            this.userGroup.get('lastName')?.patchValue(user?.lastName);
            this.userGroup.get('email')?.patchValue(user?.email);
          }
        });
    }
  }

  changePassword() {
    if (this.passwordGroup.valid) {
      this.backendService
        .doPatch<void, any>(
          `user/${this.user()?.uuid}`,
          this.passwordGroup.value,
        )
        .pipe(first())
        .subscribe({
          next: () =>
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Password successfully changed.',
            }),
          error: () =>
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Password could not be changes.',
            }),
        });
    }
  }

  updateUser() {
    if (this.userGroup.valid) {
      const formData = new FormData();

      Object.keys(this.userGroup.controls).forEach((key) => {
        const value = this.userGroup.get(key)?.value;
        formData.append(key, value);
      });
      formData.append('avatar', this.fileUpload().files[0]);

      this.backendService
        .doPut<User, any>(`user/${this.user()?.uuid}`, formData)
        .pipe(first())
        .subscribe({
          next: (user) => {
            this.user.set(user);
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Info successfully updated.',
            });
          },
        });
      this.fileUpload().upload();
    }
  }

  onAvatarSelected(event: FileSelectEvent) {
    this.avatar.set(URL.createObjectURL(event.files[0]));
  }

  protected readonly Avatar = Avatar;
}
