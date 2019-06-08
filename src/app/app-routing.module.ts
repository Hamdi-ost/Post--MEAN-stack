import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListPostComponent } from './components/posts/list-post/list-post.component';
import { CreatePostComponent } from './components/posts/create-post/create-post.component';
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { AuthGuard } from './components/auth/auth.guard';

const routes: Routes = [
    { path: '', component: ListPostComponent },
    { path: 'create', component: CreatePostComponent, canActivate: [AuthGuard] },
    { path: 'edit/:postId', component: CreatePostComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [AuthGuard]
})

export class AppRoutingModule { }
