// post.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { PostData } from 'src/app/pages/post-feed/post-feed.component';
import {UserDocument} from 'src/app/app.component'
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { MatDialog } from '@angular/material/dialog';
import { ReplyComponent } from 'src/app/tools/reply/reply.component';


@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  @Input() postData: PostData | undefined;
  @Input()  user: UserDocument = {
    publicName: '', description: '', userId: '',
    creatorId: ''
  };
  creatorName: string | undefined;
  creatorDescription: string | undefined;
  likesCount: number = 0;
  isLiked: boolean = false;
  firestore = new FirebaseTSFirestore();
 
 
  constructor(private dialog: MatDialog) {
   
  }

  ngOnInit(): void {
    this.getCreatorInfo();
   // console.log('User:', this.user);
   this.loadLikes();
   
   
  }

  onReplyClick() {
    this.dialog.open(ReplyComponent, { data: this.postData?.postId });
  }

  onLikeClick() {
    if (!this.isLiked) {
      // Si el usuario no ha dado like, incrementa el recuento y marca como liked
      this.likesCount++;
      this.isLiked = true;

      // Actualiza la información en Firebase
      this.firestore.update({
        path: ["Likes", this.postData!.postId],
        data: { count: this.likesCount, [this.user.userId]: true },
      });
    } else {
      // Si el usuario ya ha dado like, decrementa el recuento y marca como no liked
      this.likesCount--;
      this.isLiked = false;

      // Actualiza la información en Firebase
      this.firestore.update({
        path: ["Likes", this.postData!.postId],
        data: { count: this.likesCount, [this.user.userId]: false },
      });
    }
  }

  loadLikes() {
    this.firestore.getDocument({
      path: ["Likes", this.postData!.postId],
      onComplete: (result) => {
        const likesData = result.data();

        if (likesData) {
          this.likesCount = likesData['count'] || 0;
          this.isLiked = likesData[this.user.userId] || false;
        } else {
          // Si no hay datos de likes, crea la entrada en la colección "Likes"
          this.firestore.create({
            path: ["Likes", this.postData!.postId],
            data: { count: 0 },
          });
        }
      },
    });
  }


  
  getCreatorInfo() {
    this.firestore.getDocument({
      path: ["Users", this.postData!.creatorId],
      onComplete: result => {
        let userDocument = result.data();

       // Verificar que userDocument no sea nulo antes de intentar acceder a sus propiedades
       if (userDocument) {
        // Utilizar notación de corchetes para acceder a propiedades
        this.creatorName = userDocument['publicName'];
        this.creatorDescription = userDocument['description'];
      }
      }
    });
  }
}
