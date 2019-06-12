import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListPostComponent } from './components/posts/list-post/list-post.component';
import { CreatePostComponent } from './components/posts/create-post/create-post.component';
import { AuthGuard } from './components/auth/auth.guard';

const routes: Routes = [
    { path: '', component: ListPostComponent },
    { path: 'create', component: CreatePostComponent, canActivate: [AuthGuard] },
    { path: 'edit/:postId', component: CreatePostComponent, canActivate: [AuthGuard] },
    { path: 'auth', loadChildren: './components/auth/auth.module#AuthModule' }

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [AuthGuard]
})

export class AppRoutingModule { }
