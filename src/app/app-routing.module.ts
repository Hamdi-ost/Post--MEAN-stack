import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ListPostComponent } from './components/posts/list-post/list-post.component';
import { CreatePostComponent } from './components/posts/create-post/create-post.component';
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';

const routes: Routes = [
    { path: '', component: ListPostComponent },
    { path: 'create', component: CreatePostComponent },
    { path: 'edit/:postId', component: CreatePostComponent },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent }
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }
