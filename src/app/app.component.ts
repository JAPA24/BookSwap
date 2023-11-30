import { Component } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { AuthenticatorComponent} from './tools/authenticator/authenticator.component';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { Router } from '@angular/router';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'proyectoBookSwap';
  auth = new FirebaseTSAuth();
  firestore = new FirebaseTSFirestore();
  userHasProfile = true;
  static userDocument: UserDocument = {
    publicName: '', description: '', userId: '',
    creatorId: undefined
  };
 
 

  constructor(private loginSheet: MatBottomSheet , private router:Router){
    
    this.auth.listenToSignInStateChanges(
      user => {
        this.auth.checkSignInState({
          whenSignedIn: user => {
           //alert("Bienvenido")
           this.router.navigate(["postfeed"]);
          },
          whenSignedOut: user =>{
            AppComponent.userDocument = { publicName: '', description: '', userId: '' ,creatorId:'' };
            this.router.navigate(["**"]);
            // alert("Salió")

          },
          whenSignedInAndEmailNotVerified: user =>{
            this.router.navigate(["emailVerification"]);

          },
          whenSignedInAndEmailVerified: user => {
            this.getUserProfile();
          },
          whenChanged: user => {
          
          }
        })
      }
    )
  }

  public static getUserDocument(){
    return AppComponent.userDocument;
  }

  getUserName(){
   
    try {
      return AppComponent.userDocument.publicName;
    } catch (err) {
      return console.error('Error en getUserName:', err);
    }

    
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
  onLogoutClick(){
    location.reload();
    this.auth.signOut();  
  }

  loggedIn(){
    return this.auth.isSignedIn();
    
  }

  onLoginClick(){
    this.loginSheet.open(AuthenticatorComponent)
    
  }

  
}

export interface UserDocument{
creatorId: any|string;
  
  publicName: string;
  description: string;
  userId: string;
}