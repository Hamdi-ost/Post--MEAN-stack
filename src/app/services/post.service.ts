import { Injectable } from '@angular/core';
import { Post } from '../models/post';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class PostService {

  post: Post[] = [];
  url = 'http://localhost:3000/api/posts';

  constructor(private http: HttpClient) { }

  getAllPost() {
    return this.http
      .get<{ message: string, posts: any }>(this.url)
      .pipe(map((postData) => {
        return postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id
          };
        })
      }));
  }

  addPost(post: Post) {
    return this.http.post<{ message: string }>(this.url, post);
  }

}
