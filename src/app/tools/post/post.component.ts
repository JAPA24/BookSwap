import { Component, Input, OnInit } from '@angular/core';
import { PostData } from 'src/app/pages/post-feed/post-feed.component';
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
creatorName: string | undefined;
creatorDescription: string | undefined;
firestore = new FirebaseTSFirestore();

constructor( private dialog: MatDialog){
}

  ngOnInit(): void {
    this.getCreatorInfo();
  }
  onReplyClick(){
    this.dialog.open(ReplyComponent, {data: this.postData?.postId});
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

