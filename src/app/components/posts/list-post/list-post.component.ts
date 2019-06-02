import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/models/post';
import { NgForm } from '@angular/forms';
import { PostService } from 'src/app/services/post.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-list-post',
  templateUrl: './list-post.component.html',
  styleUrls: ['./list-post.component.css']
})
export class ListPostComponent implements OnInit {

  posts: Post[] = [];
  private readonly onDestroy = new Subject<void>();

  constructor(private postService: PostService) { }

  isLoading = false;

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.isLoading = true;
    this.postService.getAllPost()
      .pipe(takeUntil(this.onDestroy))
      .subscribe(data => {
        this.isLoading = false;
        this.posts = data;
      });
  }

  delete(postId: string) {
    this.postService.deletePost(postId)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(() => {
        this.fetchData();
      });
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
  }



}
