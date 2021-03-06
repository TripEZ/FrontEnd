import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { FixedFooterComponent } from './components/fixed-footer/fixed-footer.component';
import { FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { MainNavComponent } from './components/main-nav/main-nav.component';
import { TripOverviewComponent } from './pages/trip-overview/trip-overview.component';
import { EditTripsComponent } from './pages/edit-trips/edit-trips.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { EditProfileComponent } from './pages/edit-profile/edit-profile.component';
import { ReviewComponent } from './pages/review/review.component';

import {Interceptor} from '../app/Interceptor';
import { CreateTripComponent } from './pages/create-trip/create-trip.component';

import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { WeatherWidgetComponent } from './components/weather-widget/weather-widget.component';
import { AgmCoreModule } from '@agm/core';
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import { GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';
import { LookupComponent } from './pages/lookup/lookup.component';

@NgModule({
  declarations: [
    AppComponent,
    RegistrationComponent,
    FixedFooterComponent,
    LoginComponent,
    HomeComponent,
    MainNavComponent,
    TripOverviewComponent,
    EditTripsComponent,
    ProfileComponent,
    EditProfileComponent,
    CreateTripComponent,
    WeatherWidgetComponent,
    ReviewComponent,
    LookupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    GraphQLModule,
    HttpClientModule,
    FormsModule,
    HttpClientModule,
    GooglePlaceModule,
    SocialLoginModule,  
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDyeVGrTRpKscrLAEtA0MyD4bpjEPXxrSY'
    })
  ],
  providers: [
    {
      provide:HTTP_INTERCEPTORS,
      useClass:Interceptor,
      multi:true
    },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: true,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('405903455242-oasrtv1gi37basoeksteadlhbij7dnss.apps.googleusercontent.com')
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('1359002451497470')
          }
        ]
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
