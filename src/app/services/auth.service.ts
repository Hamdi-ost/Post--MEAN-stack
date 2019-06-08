import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Auth } from '../models/auth';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;

  private authStatusListener = new Subject<boolean>();

  url = 'http://localhost:3000/api/user';

  constructor(private http: HttpClient, private router: Router) { }

  getToken() {
    return this.token;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  createUser(email: string, password: string) {
    const authDate: Auth = { email: email, password: password };
    return this.http.post(this.url + '/signup', authDate);
  }

  login(email: string, password: string) {
    const authDate: Auth = { email: email, password: password };
    this.http.post<{ token: string, expiresIn: number }>(this.url + '/login', authDate)
      .subscribe(res => {
        const token = res.token;
        this.token = token;
        if (this.token) {
          const expiresInDuration = res.expiresIn;
          this.tokenTimer = setTimeout(() => {
            this.logout();
          }, expiresInDuration * 1000); // *1000 cuz it works with milliseconds
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          this.router.navigate(['/']);
        }
      });
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.router.navigate(['/']);
    clearTimeout(this.tokenTimer);
  }
}
