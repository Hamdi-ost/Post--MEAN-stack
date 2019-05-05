import { Injectable } from '@angular/core';
import { Post } from '../models/post';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  post: Post[] = [];
  url = 'http://localhost:3000/api/posts';

  constructor(private http: HttpClient) { }

  getAllPost() {
    return this.http.get<{ message: string, posts: Post[] }>(this.url);
  }

  addPost(post: Post) {
    return this.http.post<{ message: string }>(this.url, post);
  }

}
