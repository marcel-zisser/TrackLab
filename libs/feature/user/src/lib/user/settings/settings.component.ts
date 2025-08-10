import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { Avatar } from 'primeng/avatar';
import { Divider } from 'primeng/divider';
import { AuthenticationService, BackendService } from '@tracklab/services';
import { User } from '@tracklab/models';
import { first, from, of, switchMap } from 'rxjs';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'tl-settings',
  imports: [
    Avatar,
    Divider,
    InputText,
    Button,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {
  private readonly authenticationService = inject(AuthenticationService);
  private readonly backendService = inject(BackendService);
  private readonly fb = inject(FormBuilder);

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

  constructor() {
    from(this.authenticationService.getDecodedToken())
      .pipe(
        first(),
        switchMap((token) => {
          if (token) {
            return this.backendService.doGet<User>(`user/${token.sub}`);
          } else {
            return of(undefined);
          }
        }),
      )
      .subscribe((user: User | undefined) => {
        this.user.set(user);

        if (user) {
          this.userGroup.get('firstName')?.patchValue(user?.firstName);
          this.userGroup.get('lastName')?.patchValue(user?.lastName);
          this.userGroup.get('email')?.patchValue(user?.email);
        }
      });
  }

  changePassword() {}

  updateUser() {
    if (this.userGroup.valid) {
      this.backendService
        .doPut<User, any>(`user/${this.user()?.uuid}`, this.userGroup.value)
        .pipe(first())
        .subscribe((user) => this.user.set(user));
    }
  }
}
