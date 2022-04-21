import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationEnd, NavigationStart, RouterEvent } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Subscription } from 'rxjs';

interface reviewResponse{
  getReview : {
    review : review[]
  };
}

interface inputReview{
  userId:any;
  reviewName:string;
  reviewEmail:string;
  reviewCountry:string;
  reviewText:string;
}

interface review{
  _id:string;
  reviewName:string;
  reviewEmail:string;
  reviewCountry:string;
  reviewText:string;
}

const Review = gql`
mutation submitReview($reviewName:String!,$reviewEmail:String!,$reviewCountry:String!,$reviewText:String!){
  submitReview(inputReview:{reviewName:$reviewName,reviewEmail:$reviewEmail,reviewCountry:$reviewCountry,reviewText:$reviewText}){
      reviewName
      reviewEmail
      reviewCountry
      reviewText
    }
  } 
`;

const submitReview=gql`
mutation submitReview($inputReview:inputReviewData!)
{
  submitReview(inputReview:$inputReview){
    _id
  }
}

`;

const deleteReview =gql`

mutation deleteReview($reviewId:String!){
  deleteReview(reviewId:$reviewId)
}
`;

const getReviews = gql`

query getReviews($reviewId:String!)
{
   getReviews(reviewId:$reviewId){
    review{
      reviewName
      reviewEmail
      reviewCountry
      reviewText
    }
  }
}
`;

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit {

  constructor(private apollo : Apollo,private router:Router,private route: ActivatedRoute) {
    this.router.events.subscribe(res=>{
      if(res instanceof NavigationEnd){
        this.getReviewsOnLoad();
      }

    })
  }

  reviewForm = new FormGroup({
    reviewName : new FormControl('',[Validators.required]),
    reviewEmail : new FormControl('',[Validators.required,Validators.email]),
    reviewCountry : new FormControl('',[Validators.required]),
    reviewText : new FormControl('',[Validators.required])
  });

  allReviews : review[]=[];
  private querySubscription!: Subscription;
  ngOnInit(): void {
    this.getReviewsOnLoad();
  }

  getReviewsOnLoad(){
    this.querySubscription = this.apollo.watchQuery<reviewResponse>({
      query:getReviews,
      variables:{
        reviewid : localStorage.getItem("accesstokenid")
      }
    }).valueChanges.subscribe((data)=>{
      this.allReviews = data.data.getReview.review
      
    })
  }

  deleteReview(id:any,index:any){
    this.apollo.mutate({

      mutation:deleteReview,

      variables:{
        reviewId:id
      },

    }).subscribe(res=>{
      
      let currentReviews = [...this.allReviews];
      currentReviews.splice(index,1);
      this.allReviews = currentReviews;
    })
  }

  submitReview(){

    this.apollo.mutate({
      mutation:Review,
      variables:{
        reviewName:this.reviewForm.controls.reviewName.value,
        reviewEmail:this.reviewForm.controls.reviewEmail.value,
        reviewCountry:this.reviewForm.controls.reviewCountry.value,
        reviewText:this.reviewForm.controls.reviewText.value,
      }
    }).subscribe(res=>{
      this.router.navigateByUrl("/home")
    })
  }

}