import { beforeEach, describe, expect, it } from "vitest";
import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { API_URL_TOKEN, AuthenticationService, Theme, ThemeService, UserService } from "@tracklab/services";
import { JwtHelperService } from "@auth0/angular-jwt";
import { ConfirmationService, MessageService } from "primeng/api";
import { signal } from "@angular/core";
import { ConfirmDialogModule } from "primeng/confirmdialog";
describe('AppComponent', () => {

  const themeServiceMock: Partial<ThemeService>= {
    theme: signal(Theme.Light)  
  }

  const authServiceMock: Partial<AuthenticationService>= {
    isAuthenticated: signal(false)  
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterModule.forRoot([]), ConfirmDialogModule],
      providers: [
        { provide: API_URL_TOKEN, useValue: 'http://localhost:3000' },
        { provide: JwtHelperService, useValue: {}},
        { provide: AuthenticationService, useValue: authServiceMock },
        { provide: UserService, useValue: {} },
        { provide: ThemeService, useValue: themeServiceMock },
        ConfirmationService,
        MessageService
      ]
    }).compileComponents();
  });
  it('should define the confirmation dialog component', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('p-confirm-dialog')).toBeDefined();
  });
});
