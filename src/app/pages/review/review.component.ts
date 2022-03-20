import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';
import {map} from "rxjs/operators";

const Review = gql`
mutation getUserById($Id:String!){
    getUserById(Id:$Id){
      name
      email
    }
  } 
`;

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit {

  constructor(private apollo :Apollo,private router:Router) { }

  reviewForm = new FormGroup({
    email : new FormControl('',[Validators.required,Validators.email]),
    name : new FormControl('',[Validators.required]),
  });

  ngOnInit(): void {
  }

  review(){
    
    this.apollo.mutate({
      mutation :Review,
      variables:{
        email:this.reviewForm.controls.email.value,
        name:this.reviewForm.controls.name.value,
        phone:this.reviewForm.controls.name.value,
        password:this.reviewForm.controls.password.value,
      }
    }).subscribe(res=>{
      this.router.navigateByUrl("/home")
    });
  }

}