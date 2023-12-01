import { Component, Input, OnInit } from '@angular/core';
import {FirebaseTSFirestore} from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent  {
  @Input()
  show: boolean = true;

  firestore: FirebaseTSFirestore;
  auth: FirebaseTSAuth;
  constructor() {
    this.firestore = new FirebaseTSFirestore();
    this.auth = new FirebaseTSAuth();
    
  }

  

  onContinueClick(
    nameInput:HTMLInputElement, 
    descriptionInput: HTMLTextAreaElement,
    emailInput: HTMLInputElement
  ){

    const authObject = this.auth.getAuth();
    if (this.auth) {
    
    if (authObject.currentUser) {
      const uid = authObject.currentUser.uid;
      let name = nameInput.value;
      let description = descriptionInput.value;
      let email = emailInput.value;
    
      this.firestore.create(
      {
        path: ["Users", uid],
        data: {
          publicName: name,
          description: description,
          publicemail: email
        },
        onComplete: (docId) => {
          alert("Perfil creado con éxito");
          nameInput.value ="";
          descriptionInput.value = "";
          emailInput.value = "";
        },
        onFail: (err) => {}
      }
    )
  }

}
}

}
