import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SocialAuthService, GoogleLoginProvider, FacebookLoginProvider, SocialUser } from 'angularx-social-login';

import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

interface responseLogin {
  login :string;
}


const Login=gql`

mutation login($email:String!,$password:String!){
  login(loginparams:{email:$email,password:$password})
}

`;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  socialUser!: SocialUser;

  constructor(private router: Router, private apollo: Apollo, private socialAuthService: SocialAuthService) { }

  loginForm =  new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password : new FormControl('', [Validators.required, Validators.minLength(8)])
  })

  ngOnInit() {
    this.socialAuthService.authState.subscribe((user) => {
      this.socialUser = user;
      console.log(this.socialUser);
    })
  }

  gotoRegister(){
    this.router.navigateByUrl("/");
  }

  login(){
    
     this.apollo.mutate<responseLogin>({
      mutation:Login,
      variables:{
        email:this.loginForm.controls.email.value,
        password: this.loginForm.controls.password.value,
      }
    }).subscribe(res=>{
      
      if(res.data?.login!=null){
      localStorage.setItem("accesstokenid",res.data?.login!)
      this.router.navigateByUrl('/home');
      }
    },(error)=>{
      
    });
  }

  loginWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  facebookSignin(): void {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }
}
