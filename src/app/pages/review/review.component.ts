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
      reviewName
      reviewEmail
      reviewCountry
      reviewText
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
    reviewName : new FormControl('',[Validators.required]),
    reviewEmail : new FormControl('',[Validators.required,Validators.email]),
    reviewCountry : new FormControl('',[Validators.required]),
    reviewText : new FormControl('',[Validators.required])
  });

  ngOnInit(): void {
  }

  review(){
    this.apollo.mutate({
      mutation :Review,
      variables:{
        reviewName:this.reviewForm.controls.reviewName.value,
        reviewEmail:this.reviewForm.controls.reviewEmail.value,
        reviewCountry:this.reviewForm.controls.reviewCountry.value,
        reviewText:this.reviewForm.controls.reviewText.value,
      }
    }).subscribe(res=>{
      this.router.navigateByUrl("/home")
    });
  }

}