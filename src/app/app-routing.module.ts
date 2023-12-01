import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { EmailVerificationComponent } from './pages/email-verification/email-verification.component';
import { PostFeedComponent } from './pages/post-feed/post-feed.component';
import { UserProfileComponent } from './user-profile/user-profile.component';


const routes: Routes = [
  {path:"",component:HomeComponent},
  {path : "emailVerification", component:EmailVerificationComponent},
  {path:"postfeed",component:PostFeedComponent},
  { path:"userprofile/:creatorId", component:UserProfileComponent},
  {path:"**",component:HomeComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
