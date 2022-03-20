import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { HttpClient } from '@angular/common/http';
import { subscribe } from 'graphql';
import { query, useAnimation } from '@angular/animations';


var s;
const getTrip=gql`
  query getTrip($tripId:String!){
    getTrip(tripId:$tripId){
      _id
      tripName
      tripLocation
      days{
        date
        location
        toDo{
          task
          isCompleted
        }
        notes
      }
      atendees{
        name
        email
        phone
      }
    }
  }
`;


interface tripResposne{
  getTrip : trip;
}

interface trip {
  tripName:string;
  tripLocation:string;
  days : {
    date : string;
    location :string[];
    todo : {
      task:string;
      isCompleted:string;
    }
    notes:string;

  }
  atendees : {
    name:string;
    email:string;
    phone:string;
  }

}

@Component({
  selector: 'app-trip-overview',
  templateUrl: './trip-overview.component.html',
  styleUrls: ['./trip-overview.component.css']
})
export class TripOverviewComponent implements OnInit {
 
  private routeSub!: Subscription  ;
  constructor(private router:Router,private route: ActivatedRoute,private apollo :Apollo,private http:HttpClient) { }

  tripId!:string;

  trip!:trip;
  atendees : any;
  days : any;

 

  ngOnInit(): void {

 console.log(this.trip)
    this.routeSub = this.route.params.subscribe(params => {
      this.tripId= params['id']
    });

    this.apollo.watchQuery<tripResposne>({
      query:getTrip,
      variables:{
        tripId:this.tripId
      }
    }).valueChanges.subscribe((data)=>{
        this.trip = data.data.getTrip
        this.atendees = data.data.getTrip.atendees;
        this.days=data.data.getTrip.days;
    });
    this.email();
  }
  shareTrip(){
    //Share trip through email here
    this.apollo.watchQuery<tripResposne>({
      query:getTrip,
      variables:{
        tripId:this.tripId
      }
    }).valueChanges.subscribe((data)=>{
        this.trip = data.data.getTrip
        this.atendees = data.data.getTrip.atendees;
        this.days=data.data.getTrip.days;
        
        
    });
     s = this.trip
    console.log(this.trip)
    console.log(this.atendees)
    console.log(this.days)
    console.log("ID TEST" + this.tripId)
    console.log("trip name test" + this.trip)



   
  } 
  name = 'Angular';
  uEmail;
  uEmails; 
  clientInfo() {
    this.apollo.watchQuery<tripResposne>({
        query:getTrip,
        variables:{
          tripId:this.tripId
        }
      }).valueChanges.subscribe((data)=>{
          this.trip = data.data.getTrip
          this.atendees = data.data.getTrip.atendees;
          this.days=data.data.getTrip.days;
          
          
      }); 
    return [
     
      
      {
        email: 'shane@dawsone.com',
      },
      {
        email: "?Subject=TripEz Trip Details&body=Hi, I'm sharing you my upcoming trip from " +
        "TripEz. Here is my TripID: " + this.tripId 
      }
    ];
  }
 
  email() {
    this.uEmails = this.clientInfo()
      .map((info) => info.email)
      .join(',');
  }
  openEdit(){
   this.router.navigateByUrl("/edit-trip/"+this.tripId);
  }

  convertPDF(){
    this.apollo.watchQuery<tripResposne>({
      query:getTrip,
      variables:{
        tripId:this.tripId
      }
    }).valueChanges.subscribe((data)=>{




      this.http.post<any>("https://api.apitemplate.io/v1/create?template_id=f2877b2b1ca0b40e&export_type=file&output_html=1&filename=Trip",
      data.data.getTrip,
      ).
      subscribe(res=>{
        
        window.open(res.url, "_blank");
      },error=>{
        
        window.open(error.url, "_blank");
      })

    });
  }



}
