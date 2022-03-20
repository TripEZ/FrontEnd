import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SocialAuthService, GoogleLoginProvider, FacebookLoginProvider, SocialUser } from 'angularx-social-login';

import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';
import {map} from "rxjs/operators";

const Register = gql`
  mutation createUser($email:String!,$name:String!,$phone:String!,$password:String!){
    createUser(userInput:{email:$email,name:$name,phone:$phone,password:$password}){
      _id
      email
      password
    }
  } 
`;

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  socialUser!: SocialUser;

  constructor(private apollo :Apollo,private router:Router, private socialAuthService: SocialAuthService) { }

  registerForm = new FormGroup({
    email : new FormControl('',[Validators.required,Validators.email]),
    name : new FormControl('',[Validators.required]),
    phone : new FormControl('',[Validators.required]),
    password : new FormControl('',[Validators.required,Validators.minLength(8)]),
  });

  ngOnInit() {
    this.socialAuthService.authState.subscribe((user) => {
      this.socialUser = user;
      console.log(this.socialUser);
    })
  }

  register(){
    
    this.apollo.mutate({
      mutation :Register,
      variables:{
        email:this.registerForm.controls.email.value,
        name:this.registerForm.controls.name.value,
        phone:this.registerForm.controls.name.value,
        password:this.registerForm.controls.password.value,
      }
    }).subscribe(res=>{
      this.router.navigateByUrl("/login")
    });
  }

  gotoSignIn(){
    this.router.navigateByUrl('/login');
  }

  registerWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  registerWithFacebook(): void {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }
}
