import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validator, Validators } from '@angular/forms';
import { Post } from 'src/app/models/post';
import { PostService } from 'src/app/services/post.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {

  form: FormGroup;
  imagePreview;

  constructor(private postService: PostService, private router: Router) { }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
      content: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, { validators: [Validators.required] })
    });
  }

  onAddPost() {
    if (this.form.invalid) {
      return;
    }
    const post: Post = {
      id: null,
      title: this.form.value.title,
      content: this.form.value.content,
    };

    this.postService.addPost(post).subscribe(data => {
      this.router.navigate(['/']);
    });
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
