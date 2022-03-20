
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import moment from 'moment';



interface tripResposne{
  getTrip : trip;
}

interface tripInput{
  userId:any;
  tripName:string;
  tripLocation:string;
  days:days[];
  atendees : atendees[];
}

interface trip {
  tripName:string;
  tripLocation:string;
  days:days[];
  atendees : atendees[];

}

interface days {
  date : string;
  location :string[];
  toDo : todo[];
  notes:string;
}


interface atendees{
  name:string;
  email:string;
  phone:string;
}

interface todo{
  task:string;
  isCompleted:boolean;
}


const createTrip=gql`
mutation createTrip($tripInput:tripInputData!)
{
  createTrip(tripInput:$tripInput){
    _id
  }
}

`;



@Component({
  selector: 'app-create-trip',
  templateUrl: './create-trip.component.html',
  styleUrls: ['./create-trip.component.css']
})
export class CreateTripComponent implements OnInit {
  zoom: number = 12;
  //geocoder = new google.maps.Geocoder();
  latitude = 0;
  longitude = 0;
  LocationLatLng= [{lat:0, lng:0}];
  places:string[] =[];
  
  options:any = {
    ComponentRestrictions :{
      country:[],
    },
    types:['establishment']
  };


  handleAddressChange(address:any,dayIndex:any){
    this.addLocation[dayIndex] = address.formatted_address;
    this.places[dayIndex] = (address.formatted_address);
    let place: google.maps.places.PlaceResult = address;
  
    if(place.geometry === undefined || place.geometry === null) {
      return;
    }
    this.latitude = place.geometry.location.lat()
    this.longitude = place.geometry.location.lng()
  }


  retriveAddressComponents(arg0: string): any {
    throw new Error('Method not implemented.');
  }

  constructor(private router:Router,private route: ActivatedRoute,private apollo :Apollo) {
   }

  ngOnInit(): void {
    this.LocationLatLng.pop();
  }

  tripName:string="";
  tripLocation:string="";

  startDate:string="";
  endDate:string="";

  form1:boolean=true;
  form2:boolean=false;

  errForm1:string="";
  nextForm(){
    if(this.tripName!="" && this.tripLocation!="" && this.startDate!=""&& this.endDate!=""){
      this.form1=false;
      this.form2=true;
      this.errForm1="";

      var date1 = new Date(this.startDate);
      var date2 = new Date(this.endDate);
      var Time = date2. getTime() - date1. getTime();
      var Days = Time / (1000 * 3600 * 24); 

      for(let i=0;i<Days+1;i++){
        this.daysCountArray.push(i);
        this.dates.push(moment(new Date(date1.getTime() + (1000 * 60 * 60 * 24)*(i+1))).format().slice(0,10));

        let array :string[] = []

        this.allLocations.push(array);
        this.allToDo.push(array);
        this.Task.push(array);
        this.Status.push(array);

      }
    }
    else{
      this.errForm1="All Fields Required"
    }

  }



  daysCountArray:any[]=[];

  dates : any[] = [];

  notes : any[] = [];

  addLocation:string[]=[];

  allLocations:string[][]=[];

  addIntoLocations(dayIndex:any){
    
    var currentdaylocations = [...this.allLocations[dayIndex]]

    currentdaylocations.push(this.addLocation[dayIndex]);

    if (this.addLocation[dayIndex] == undefined || this.addLocation[dayIndex] == "")
    {
      alert("You cannot add an empty location")
      return;
    }
    else
    {
      this.allLocations.splice(dayIndex,1,currentdaylocations);

      this.addLocation[dayIndex] = "";
    
      this.LocationLatLng.push({ lat:this.latitude, lng:this.longitude});
    }
    
  }

  removeLocation(locationIndex:any,dayIndex:any){

    var currentdaylocations = [...this.allLocations[dayIndex]]
    
    if (this.places[dayIndex] == currentdaylocations.toLocaleString()){
      this.LocationLatLng.splice(dayIndex,1);
    }
    console.log(currentdaylocations);
    console.log(this.LocationLatLng);
    currentdaylocations.splice(locationIndex,1);
    
    this.allLocations.splice(dayIndex,1,currentdaylocations);

  }



  toDotoggle :boolean[] = [];
  addTask :any = [];
  addStatus :any =[];
  allToDo : any[][] = [];

  Task : any[][] = [];
  Status: any[][]= [];


  toggleToDo(dayindex:any){
    this.toDotoggle[dayindex]=true;
  }

  discardToDo(di:any){
    this.addTask[di]=""
    this.addStatus[di] = false;
    this.toDotoggle[di] = false;
  }

  saveToDo(di:any){

    var addedToDo:todo = {
      task : this.addTask[di],
      isCompleted : this.addStatus[di]
    }

    if(addedToDo.isCompleted==undefined)
    {
      addedToDo.isCompleted=false;
    }

    
    var currentToDos = [...this.allToDo[di]]

    currentToDos.push(addedToDo);

    this.allToDo.splice(di,1,currentToDos);

    

    var CurrentTask = [...this.Task[di]]

    CurrentTask.push(addedToDo.task);

    this.Task.splice(di,1,CurrentTask);

    

    var CurrentStatus = [...this.Status[di]]

    CurrentStatus.push(addedToDo.isCompleted);

    this.Status.splice(di,1,CurrentStatus);

    

    this.discardToDo(di);

    

  }

  toDoEdited(n:any,toDoIndex:any){


    var currentToDo = [...this.allToDo[n]];
    var currentTask = [...this.Task[n]];
    var currentStatus = [...this.Status[n]];

    currentToDo[toDoIndex].task  = currentTask[toDoIndex];
    currentToDo[toDoIndex].isCompleted  = currentStatus[toDoIndex];

    this.allToDo.splice(n,1,currentToDo);


  }

  removeTodo(dayIndex:any,toDoIndex:any){

    var currentToDo = [...this.allToDo[dayIndex]];

    currentToDo.splice(toDoIndex,1);

    this.allToDo.splice(dayIndex,1,currentToDo);

    var currentTask = [...this.Task[dayIndex]]

    currentTask.splice(toDoIndex,1);

    this.Task.splice(dayIndex,1,currentTask);

    var CurrentStatus = [...this.Status[dayIndex]]

    CurrentStatus.splice(toDoIndex,1);

    this.Status.splice(dayIndex,1,CurrentStatus);


  }


  
  

  addDayToggle : boolean = false;
  newDate!:String;

  toggleAddDay(){
    if(this.addDayToggle==false)
    {
      this.addDayToggle = true;
    }
    else{
      this.addDayToggle = false;
    }
  }

  addDay(){
    this.daysCountArray.push(this.daysCountArray.length);
    this.dates.push(this.newDate);

    

    this.notes.push("");
    this.allLocations.push([]);

    this.allToDo.push([]);
    this.Task.push([]);
    this.Status.push([]);

    this.toggleAddDay();
  }

  

  addAtendeesToggle :boolean =false;

  allAtendees:atendees[]=[];

  atendeeName  !:string;
  atendeeEmail!:string;
  atendeePhone!:string;

  toggleAddAtendees(){

    if(this.addAtendeesToggle==false)
    {
      this.addAtendeesToggle = true
    }else{
      this.addAtendeesToggle = false
      this.atendeeName="";
      this.atendeeEmail='';
      this.atendeePhone='';
    }
  }


  saveAtendee(){
    var att :atendees={
      name : this.atendeeName,
      email:this.atendeeEmail,
      phone:this.atendeePhone,
    }

    this.allAtendees.push(att);
    this.toggleAddAtendees();


  }


  removeAtt(i:any){
    this.allAtendees.splice(i,1);
  }


  createTrip(){

    var allDays = [];

    for(let i=0;i<this.daysCountArray.length;i++){
      var day = {
        date : this.dates[i],
        location : this.allLocations[i],
        notes:this.notes[i],
        toDo:this.allToDo[i]
      }

     allDays.push();
    }

    var trip  = {
      userId : localStorage.getItem("accesstokenid"),
      tripName : this.tripName,
      tripLocation : this.tripLocation,
      days : allDays,
      atendees:this.allAtendees,
    }

    

    this.apollo.mutate<any>({
      mutation:createTrip,
      variables:{
        tripInput:trip,
      }
    }).subscribe(res=>{
      
      if(res.data.createTrip._id){
        location.href = '/home';
      }

    })
  }


}
