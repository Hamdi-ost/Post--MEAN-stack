import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './components/header/header.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './components/auth/auth-interceptor';
import { ErrorInterceptor } from './error-interceptor';
import { ErrorComponent } from './components/error/error.component';
import { AngularMaterialModule } from './angular-material.module';
import { PostsModule } from './components/posts/posts.module';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularMaterialModule,
    PostsModule
  ],
  providers: [
    // tslint:disable-next-line: max-line-length
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, // to activate our interceptor which add the token to the request
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }], // to activate our interceptor which handle errors
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent]
})
export class AppModule { }
