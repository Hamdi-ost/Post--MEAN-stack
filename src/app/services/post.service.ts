import { Injectable } from '@angular/core';
import { Post } from '../models/post';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { stringify } from 'querystring';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root'
})
export class PostService {

  post: Post[] = [];
  url = 'http://localhost:3000/api/posts';

  constructor(private http: HttpClient) { }

  getAllPost(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`; // for pagination
    return this.http
      .get<{ message: string, posts: any, maxPosts: number }>(this.url + queryParams)
      .pipe(map((postData) => {
        return {
          posts: postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath,
              creator: post.creator
            };
          }),
          maxPosts: postData.maxPosts
        };
      }));
  }

  getPost(id: string) {
    return this.http.get<{ _id: string, title: string, content: string, imagePath: string, creator: string }>(this.url + '/' + id);
  }

  addPost(title: string, content: string, image: File) {
    const postDate = new FormData(); // we add this cuz we can't upload an image to the backend with json format
    postDate.append('title', title);
    postDate.append('content', content);
    postDate.append('image', image, title /* file name */);
    return this.http
      .post<{ message: string, post: Post }>(this.url, postDate);
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postDate: FormData | Post;
    if (typeof (image) === 'object') {
      postDate = new FormData();
      postDate.append('id', id);
      postDate.append('title', title);
      postDate.append('content', content);
      postDate.append('image', image, title /* file name */);
    } else {
      postDate = { id: id, title: title, content: content, imagePath: image, creator: null }
    }
    return this.http.put(this.url + '/' + id, postDate);
  }

  deletePost(id: string) {
    return this.http.delete(this.url + '/' + id);
  }

}
