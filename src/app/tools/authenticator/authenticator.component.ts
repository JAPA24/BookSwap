import { Component } from '@angular/core';
import {FirebaseTSAuth} from 'firebasets/firebasetsAuth/firebaseTSAuth'

@Component({
  selector: 'app-authenticator',
  templateUrl: './authenticator.component.html',
  styleUrls: ['./authenticator.component.css']
})
export class AuthenticatorComponent {
  state = AuthenticatorCompState.LOGIN;
  firebasetsAuth : FirebaseTSAuth;
 
  constructor() {
    this.firebasetsAuth = new FirebaseTSAuth();
  }

  ngOnInit(): void {
  }

  onResetClick(resetEmail : HTMLInputElement){
    let email = resetEmail.value;
    if(this.isNotEmpty(email)){
      this.firebasetsAuth.sendPasswordResetEmail(
        {
          email:email,
          onComplete:(uc)=>{
            alert(`Mail enviado ${email} para restablecer contraseña`)
          }
        }
      );
    }
  }



  onLogin(
    loginEmail: HTMLInputElement,
    loginPassword: HTMLInputElement
  ){let email = loginEmail.value;
    let password = loginPassword.value;

    if(this.isNotEmpty(email)&& this.isNotEmpty(password)){
      this.firebasetsAuth.signInWith(
        {
          email:email,
          password:password,
          onComplete: (uc) => {
            alert("Bienvenido");
          },
          onFail:(err)=>{
           
            alert(err);
          }
        }
      )
    }

  }

  onRegisterClick (
    registerEmail: HTMLInputElement,
    registerPassword:HTMLInputElement,
    registerConfirmPassword:HTMLInputElement

  )
  {
    let email = registerEmail.value;
    let password = registerPassword.value;
    let confirmPassword = registerConfirmPassword.value;
    
    if(
      this.isNotEmpty(email)&&
      this.isNotEmpty(password)&&
      this.isNotEmpty(confirmPassword)&&
      this.isAMatch(password,confirmPassword)
    ){this.firebasetsAuth.createAccountWith(
      {
        email: email,
        password: password,
        onComplete: (uc) => {
          alert("Cuenta Creada");
          registerEmail.value = "";
          registerPassword.value = "";
          registerConfirmPassword.value = "";
        },
        onFail:(err) => {
          alert("Error en la creación de su cuenta");
        }

      }
    );}
    
    
    

  }

  isNotEmpty(text: string){
    return text != null && text.length > 0
  
  }

  isAMatch (text: string, comparedWith: string){
    return text == comparedWith;
  }

  onForgotPasswordClick(){
    this.state = AuthenticatorCompState.FORGOT_PASSWORD;
  }

  onCreateAccountClick(){
    this.state = AuthenticatorCompState.REGISTER;
  }

  onLoginClick(){
    this.state = AuthenticatorCompState.LOGIN;
  }



  isLoginState(){
    return this.state == AuthenticatorCompState.LOGIN;
  }

  isRegisterState(){
    return this.state == AuthenticatorCompState.REGISTER;
  }

  isForgotPasswordState(){
    return this.state == AuthenticatorCompState.FORGOT_PASSWORD;
  }

  getStateText(){
    switch(this.state){
      case AuthenticatorCompState.LOGIN:
        return "Iniciar sesion";
      case AuthenticatorCompState.REGISTER:
        return "Registrate";
      case AuthenticatorCompState.FORGOT_PASSWORD:
        return "Olvide contraseña";
    }
  }


}


export enum AuthenticatorCompState{
  LOGIN,
  REGISTER,
  FORGOT_PASSWORD
}


