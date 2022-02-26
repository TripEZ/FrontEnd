import { Component, OnInit } from '@angular/core';
import { Apollo, Mutation } from 'apollo-angular';
import gql from 'graphql-tag';

import { Subscription } from 'rxjs';
import { NavigationEnd, NavigationStart, Router, RouterEvent } from '@angular/router';
import { filter } from 'rxjs/operators';


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



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {



  constructor(private apollo : Apollo,private router:Router) {
    this.router.events.subscribe(res=>{
      if(res instanceof NavigationEnd){
        this.getTripsOnLoad();
      }

    })
  }

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
}

