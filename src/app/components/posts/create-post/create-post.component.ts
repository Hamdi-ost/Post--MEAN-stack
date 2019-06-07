import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validator, Validators } from '@angular/forms';
import { Post } from 'src/app/models/post';
import { PostService } from 'src/app/services/post.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {

  form: FormGroup;
  imagePreview;
  private mode = 'create';
  private postId: string;
  post: Post;

  constructor(public route: ActivatedRoute, private postService: PostService, private router: Router) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.postService.getPost(this.postId).subscribe(data => {
          this.post = { id: data._id, title: data.title, content: data.content, imagePath: data.imagePath };
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath,
          });
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    })

    this.form = new FormGroup({
      title: new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
      content: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, { validators: [Validators.required], asyncValidators: [mimeType] })
    });
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }

    if (this.mode === 'create') {
      const post = {
        id: null,
        title: this.form.value.title,
        content: this.form.value.content,
        imagePath: this.form.value.image,
      };

      this.postService.addPost(post).subscribe(data => {
        this.router.navigate(['/']);
      });
    } else {
      this.postService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    }

    this.form.reset();
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file }); // target a single controle wich is in our case the image
    this.form.get('image').updateValueAndValidity();
    // convert imageto data url that can be used by img tag in html
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

}
