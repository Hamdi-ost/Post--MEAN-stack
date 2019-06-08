import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Auth } from '../models/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  url = 'http://localhost:3000/api/user';

  constructor(private http: HttpClient) { }

  createUser(email: string, password: string) {
    const authDate: Auth = { email: email, password: password };
    return this.http.post(this.url + '/signup', authDate);
  }

  login(email: string, password: string) {
    const authDate: Auth = { email: email, password: password };
    return this.http.post(this.url + '/login', authDate);
  }
}
