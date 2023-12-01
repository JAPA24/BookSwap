import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreatePostComponent } from 'src/app/tools/create-post/create-post.component';
import { FirebaseTSFirestore, Limit, OrderBy, Where } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import {AppComponent, UserDocument} from 'src/app/app.component';
import { Router } from '@angular/router';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';

@Component({
  selector: 'app-post-feed',
  templateUrl: './post-feed.component.html',
  styleUrls: ['./post-feed.component.css']
})
export class PostFeedComponent implements OnInit {
  firestore = new FirebaseTSFirestore();
  posts: PostData [] = [];
  user!: UserDocument ;
  auth = new FirebaseTSAuth();
  
  userHasProfile = true;
  



  constructor(private dialog: MatDialog,private router:Router){}

  ngOnInit(): void {
    this.getPosts();
  }

  onCreatePostClick(){
    this.dialog.open(CreatePostComponent);
     
  }
  getUserProfile() {
    const user = this.auth.getAuth()?.currentUser; // Usar el operador de encadenamiento opcional (?)
  
    if (user) {
      this.firestore.listenToDocument({
        name: "Getting Document",
        path: ["Users", user.uid],
        onUpdate: (result) => {
          AppComponent.userDocument = <UserDocument>result.data();
          this.userHasProfile = result.exists;
  
          // Verificar si userDocument y userDocument.userId son válidos antes de asignar
          if (AppComponent.userDocument && user.uid) {
            AppComponent.userDocument.userId = user.uid;
          }
  
          if (this.userHasProfile) {
            this.router.navigate(["postfeed"]);
          }
        }
      });
    }
  }

  getPosts(){
      this.firestore.getCollection({
        path: ["Posts"],
        where: [
          new OrderBy("timestamp", "desc"),
          new Limit(10)
        ],
        onComplete: (result) => {
          result.docs.forEach(
            doc => {
              let post = <PostData>doc.data();
              post.postId = doc.id;
              this.posts.push(post);
            }
          );
        },
        onFail: err => {

        }
      }
    );
   
  }
}

export interface PostData{
  comment: string;
  creatorId: string;
  imageUrl?: string;
  postId: string;
  likes: number;
  likesBy: string[];


}