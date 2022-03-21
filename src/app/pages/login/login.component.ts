import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
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
  socialForm!: FormGroup;
  socialUser!: SocialUser;
  isLoggedIn!: boolean;

  constructor(private router: Router, private apollo: Apollo, private socialAuthService: SocialAuthService, private formBuilder: FormBuilder) { }

  loginForm =  new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password : new FormControl('', [Validators.required, Validators.minLength(8)])
  })

  ngOnInit() {
    this.socialForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    })

    this.socialAuthService.authState.subscribe((user) => {
      this.socialUser = user;
      //console.log(this.socialUser);
    })
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

  gotoRegister(){
    this.router.navigateByUrl("/");
  }

  loginWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then((data) => {
      localStorage.setItem("accesstokenid", JSON.stringify(data.authorizationCode));
      localStorage.setItem("name", JSON.stringify(data.name));
      localStorage.setItem("email", JSON.stringify(data.email));
      localStorage.setItem("id", JSON.stringify(data.id));
      this.router.navigateByUrl('/home');
    });
  }

  facebookSignin(): void {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID).then((data) => {
      localStorage.setItem("accesstokenid", JSON.stringify(data.authToken));
      localStorage.setItem("name", JSON.stringify(data.name));
      localStorage.setItem("email", JSON.stringify(data.email));
      this.router.navigateByUrl('/home');
    });
  }


}
