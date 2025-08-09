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

@Component({
  selector: 'tl-settings',
  imports: [Avatar, Divider, InputText, Button],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {
  private readonly authenticationService = inject(AuthenticationService);
  private readonly backendService = inject(BackendService);
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
      });
  }
}
