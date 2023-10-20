import { Component, Input, OnInit } from '@angular/core';
import {FirebaseTSFirestore} from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  @Input() show: boolean = false;

  firestore: FirebaseTSFirestore;
  auth: FirebaseTSAuth;
  constructor() {
    this.firestore = new FirebaseTSFirestore();
    this.auth = new FirebaseTSAuth();
    
  }

  ngOnInit(): void {

  }

  onContinueClick(
    nameInput:HTMLInputElement, 
    descriptionInput: HTMLTextAreaElement
  ){

    const authObject = this.auth.getAuth();
    if (this.auth) {
    
    if (authObject.currentUser) {
      const uid = authObject.currentUser.uid;
      let name = nameInput.value;
      let description = descriptionInput.value;
    
      this.firestore.create(
      {
        path: ["Users", uid],
        data: {
          publicName: name,
          description: description
        },
        onComplete: (docId) => {
          alert("Perfil creado con exito");
          nameInput.value ="";
          descriptionInput.value = "";
        },
        onFail: (err) => {}
      }
    )
  }

}
}

}
