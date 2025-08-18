import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { ProductBatchService } from '../../services/product-batch.service';
@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, MatButtonModule, MatInputModule, MatFormFieldModule],
    template: `
    <div class="login-container">
      <h2>Login</h2>
      <mat-form-field appearance="fill">
        <mat-label>Username</mat-label>
        <input matInput [(ngModel)]="username">
      </mat-form-field>
      <mat-form-field appearance="fill">
        <mat-label>Password</mat-label>
        <input matInput type="password" [(ngModel)]="password">
      </mat-form-field>
      <button mat-raised-button color="primary" (click)="login()">Login</button>
    </div>
  `,
    styles: [`
    .login-container {
      max-width: 300px;
      margin: 100px auto;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
  `],
  providers: [
    {   provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ]
})
export class LoginComponent {
    username = '';
    password = '';
    errorMessage = '';

    constructor(private http: HttpClient, private router: Router, private batchService:ProductBatchService) { }

    login() {
        if (!this.username || !this.password) {
            this.errorMessage = 'Please enter username and password';
            return;
        }

        const loginPayload = {
            username: this.username,
            password: this.password
        };

        this.batchService.login(loginPayload)
            .subscribe({
                next: (res) => {
                    // Store token, username, and role
                    localStorage.setItem('token', res.token);
                    localStorage.setItem('username', this.username);
                    localStorage.setItem('role', res.role);

                    // Redirect to inventory
                    this.router.navigate(['/inventory']);
                },
                error: () => {
                    this.errorMessage = 'Invalid username or password';
                }
            });
      }
}
