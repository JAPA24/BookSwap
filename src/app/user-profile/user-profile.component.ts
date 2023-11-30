import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirebaseTSFirestore, Limit, OrderBy, Where } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  userId: string | null = null;
  userData: any; // Información del usuario
  userPosts: any[] = []; // Publicaciones del usuario
  firestore = new FirebaseTSFirestore();
post: any;

  constructor(private route: ActivatedRoute,private datePipe: DatePipe) {}

  ngOnInit(): void {
    // Obtener el ID del usuario de la ruta
   
    this.route.paramMap.subscribe((params) => {
      this.userId = params.get('creatorId');
      this.getUserData();
      this.getUserPosts();
      console.log(params.get('creatorId'));
      console.log(params);
      
    });
   
  }

  getUserData(): void {
    // Asegurarse de que this.userId no sea nulo antes de realizar la consulta
    if (this.userId) {
      // Obtener datos del usuario desde FirebaseTSFirestore
      console.log('getUserData called with userId:', this.userData);
      this.firestore.getDocument({
        path: ['Users', this.userId],
        onComplete: (result) => {
          this.userData = result.data();
          
        },
      });
    }
  }
  
  getUserPosts(): void {
    // Obtener publicaciones del usuario desde FirebaseTSFirestore
    console.log('getUserPosts called with userId:', this.userPosts);
    this.firestore.getCollection({
      path: ['Posts'],
      where: [new Where('creatorId', '==', this.userId),
     new OrderBy('timestamp', 'desc'),
     new Limit(10),
    ],
    onComplete: (result) => {
      this.userPosts = result.docs.map((doc) => {
        const postData = doc.data();
        postData['postId'] = doc.id;
        postData['timestampFormatted'] = this.formatTimestamp(postData['timestamp']);
        return postData;
      });
    },
    });
  }
  
 formatTimestamp(timestamp: any): string {
  if (timestamp instanceof Date) {
    // Si ya es una instancia de Date, simplemente lo formateamos
    return timestamp.toLocaleString('es-ES', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' }) || '';
  } else if (timestamp && timestamp.seconds) {
    // Si es un objeto Timestamp de Firestore, realizamos la conversión
    const milliseconds = timestamp.seconds * 1000 + timestamp.nanoseconds / 1e6;
    const date = new Date(milliseconds);
    return date.toLocaleString('es-ES', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' }) || '';
  } else {
    // En caso contrario, retornamos una cadena vacía
    return '';
  }
}
}