import { Component } from '@angular/core';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent {
  selectedImageFile: File | undefined;

  onPhotoSelected(photoSelector: HTMLInputElement) {
    if (photoSelector.files && photoSelector.files.length > 0) {
      this.selectedImageFile = photoSelector.files[0];
      let fileReader = new FileReader();

      fileReader.addEventListener(
        "loadend",
        (ev: Event) => {
          if (fileReader.result) {
            let readableString = fileReader.result.toString();
            let postPreviewImage = <HTMLImageElement>document.getElementById("post-preview-image");
            
            if (postPreviewImage) {
              postPreviewImage.src = readableString;
            }
          }
        }
      );

      fileReader.readAsDataURL(this.selectedImageFile);
    }
  }
}
