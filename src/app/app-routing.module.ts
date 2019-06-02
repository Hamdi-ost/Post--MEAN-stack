import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ListPostComponent } from './components/posts/list-post/list-post.component';
import { CreatePostComponent } from './components/posts/create-post/create-post.component';

const routes: Routes = [
    { path: '', component: ListPostComponent },
    { path: 'create', component: CreatePostComponent }
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }
