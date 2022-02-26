import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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

  constructor(private router : Router,private apollo:Apollo) { }

  loginForm =  new FormGroup({
    email: new FormControl('',[Validators.required,Validators.email]),
    password : new FormControl('',[Validators.required,Validators.minLength(8)])
  })

  ngOnInit(): void {
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



}
