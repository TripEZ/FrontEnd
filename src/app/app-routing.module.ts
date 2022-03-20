import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditTripsComponent } from './pages/edit-trips/edit-trips.component';
import { EditProfileComponent } from './pages/edit-profile/edit-profile.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { TripOverviewComponent } from './pages/trip-overview/trip-overview.component';
import { ReviewComponent } from './pages/review/review.component';
import {CreateTripComponent} from './pages/create-trip/create-trip.component';
import { LoginRegisterGuard } from './guards/login-register.guard';
import { AuthorizedGuard } from './guards/authorized.guard';

const routes: Routes = [

  {path:'',component:RegistrationComponent, canActivate:[AuthorizedGuard]},
  {path:'registration',component:RegistrationComponent, canActivate:[AuthorizedGuard]},
  {path:'login',component:LoginComponent, canActivate:[AuthorizedGuard]},
  {path:'home',component:HomeComponent, canActivate:[LoginRegisterGuard]},
  {path:'trip-overview/:id',component:TripOverviewComponent, canActivate:[LoginRegisterGuard]},
  {path:'edit-trip/:id',component:EditTripsComponent, canActivate:[LoginRegisterGuard]},
  {path:'profile', component:ProfileComponent, canActivate:[LoginRegisterGuard]},
  {path:'editprofile', component:EditProfileComponent, canActivate:[LoginRegisterGuard]},
  {path:'createTrip',component:CreateTripComponent, canActivate:[LoginRegisterGuard]},
  {path:'review',component:ReviewComponent, canActivate:[LoginRegisterGuard]},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
