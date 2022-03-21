import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavigationEnd, NavigationStart, RouterEvent } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';
import {map} from "rxjs/operators";
import { Subscription } from 'rxjs';

interface tripResponse{
  getUsersTrip : {
    trips :trips[]
    
  };
}

interface trips{

      tripLocation : string;
      tripName:string;
      _id:string;
      days : days[]

}

interface days{
  date:String
}


const deleteTrip =gql`

mutation deleteTrip($tripId:String!){
  deleteTrip(tripId:$tripId)
}
`;

const getTrips = gql`

query getUsersTrip($userid:String!)
{
   getUsersTrip(userid:$userid){
    trips{
      tripLocation
      tripName
      _id
      days{
        date
      }
    }
  }
}

`;
const Lookup = gql`
mutation getUserById($Id:String!){
    getUserById(Id:$Id){
      lookup
    }
  } 
`;

@Component({
  selector: 'app-lookup',
  templateUrl: './lookup.component.html',
  styleUrls: ['./lookup.component.css']
})
export class LookupComponent implements OnInit {

  constructor(private apollo :Apollo,private router:Router) { 
    this.router.events.subscribe(res=>{
      if(res instanceof NavigationEnd){
        this.getTripsOnLoad();
      }

    })
  }

  lookupForm = new FormGroup({
    lookup : new FormControl('',[Validators.required])
  });
  allTrips : trips[]=[];
  private querySubscription!: Subscription;
  ngOnInit(): void {
    this.getTripsOnLoad();
  }

  openTrips(id:any){

    this.router.navigateByUrl("/trip-overview/"+id);
  }

  getTripsOnLoad(){
    this.querySubscription = this.apollo.watchQuery<tripResponse>({
      query:getTrips,
      variables:{
        userid : localStorage.getItem("accesstokenid")
      }
    }).valueChanges.subscribe((data)=>{
      this.allTrips = data.data.getUsersTrip.trips
      
    })


  }
  deleteTrip(id:any,index:any){
    this.apollo.mutate({

      mutation:deleteTrip,

      variables:{
        tripId:id
      },

    }).subscribe(res=>{
      
      let currentTrips = [...this.allTrips];
      currentTrips.splice(index,1);
      this.allTrips = currentTrips;
    })
  }


  createTrip(){
    this.router.navigateByUrl("/createTrip");
  }
  lookup(){
    this.apollo.mutate({
      mutation :Lookup,
      variables:{
        lookup:this.lookupForm.controls.lookup.value
      }
    }).subscribe(res=>{
      this.router.navigateByUrl("/home")
    });
  }

}