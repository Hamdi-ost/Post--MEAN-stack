import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/models/post';
import { NgForm } from '@angular/forms';
import { PostService } from 'src/app/services/post.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-list-post',
  templateUrl: './list-post.component.html',
  styleUrls: ['./list-post.component.css']
})
export class ListPostComponent implements OnInit {

  posts: Post[] = [];
  totalPosts = 0; // for pagination
  postsPerPage = 2;
  pageSizeOptions = [1, 2, 5, 10];
  currentPage = 1;

  private readonly onDestroy = new Subject<void>();

  constructor(private postService: PostService) { }

  isLoading = false;

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.isLoading = true;
    this.postService.getAllPost(this.postsPerPage, this.currentPage)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(data => {
        this.isLoading = false;
        this.posts = data.posts;
        this.totalPosts = data.maxPosts;
      });
  }

  delete(postId: string) {
    this.postService.deletePost(postId)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(() => {
        this.fetchData();
      });
  }

  onChangePage(pageDate: PageEvent) {
    this.postsPerPage = pageDate.pageIndex + 1;
    this.currentPage = pageDate.pageSize;
    console.log(pageDate);
    this.fetchData();
  }


  ngOnDestroy(): void {
    this.onDestroy.next();
  }



}
