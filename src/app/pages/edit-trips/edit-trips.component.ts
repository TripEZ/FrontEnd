import { CursorError } from '@angular/compiler/src/ml_parser/lexer';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { Observable, Subscription } from 'rxjs';




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

const editTrip=gql`
mutation editUserTrip($tripid:String!,$tripData:tripInputData!)
{
  editUserTrip(tripid:$tripid,tripData:$tripData){
    _id
  }

}
`;


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


@Component({
  selector: 'app-edit-trips',
  templateUrl: './edit-trips.component.html',
  styleUrls: ['./edit-trips.component.css']
})
export class EditTripsComponent implements OnInit {

  private routeSub!: Subscription ;
  constructor(private router:Router,private route: ActivatedRoute,private apollo :Apollo) { }

  tripId!:string;
  atendees : atendees[] = [];
  addedatendees : atendees[] = [];
  days : any;

  actualdays : days[]=[];

  options:any = {
    ComponentRestrictions :{
      country:[],
    },
    types:['establishment']
  };

  handleAddressChange(address:any,dayIndex:any){
    this.dayLocation[dayIndex] = address.formatted_address;
  }


  

  tripLocationInput!:string ;
  tripNameInput!:string;

  
  attName:string[]=[];
  attEmail:string[]=[];
  attPhone:string[]=[];

  addattName!:string;
  addattEmail!:string;
  addattPhone!:string;


  addedattName:string[]=[];
  addedattEmail:string[]=[];
  addedattPhone:string[]=[];


  


  dayDate:string[]=[];
  dayNotes:string[]=[];

  dayLocation:string[] =[];


  dayTodoTask:string[][]=[];
  dayTodoStatus:boolean[][]=[];


  

  allDayLocations:string[][]=[];
  allDaytoDo:todo[][]=[];

  

  trip! : Observable<any>;
  

  ngOnInit(): void {

    this.routeSub = this.route.params.subscribe(params => {
      this.tripId= params['id']
    });

     this.apollo.watchQuery<tripResposne>({
      query:getTrip,
      variables:{
        tripId:this.tripId
      }
    }).valueChanges.subscribe((data)=>{
        this.tripLocationInput = data.data.getTrip.tripLocation
        this.tripNameInput = data.data.getTrip.tripName
        this.atendees = data.data.getTrip.atendees
        for(let i=0;i<this.atendees.length;i++){

          this.attName.push(this.atendees[i].name)
          this.attEmail.push(this.atendees[i].email)
          this.attPhone.push(this.atendees[i].phone)

        }

        this.days=data.data.getTrip.days;

        

        for(let i=0;i<this.days.length;i++){
          
         this.allDayLocations.push(this.days[i].location)

        }

        


        for(let i=0;i<this.days.length;i++){
          this.dayDate.push(this.days[i].date);
          this.dayNotes.push(this.days[i].notes);

          let taskArray :string[] = [];
          let statusArray:boolean[]=[];
          this.allDaytoDo.push(this.days[i].toDo)
          for(let j=0;j<this.days[i].toDo.length;j++){

            taskArray.push(this.days[i].toDo[j].task);
            statusArray.push(this.days[i].toDo[j].isCompleted);
          }


          this.dayTodoTask.push(taskArray);
          this.dayTodoStatus.push(statusArray);
          


        }
        return data.data.getTrip.days;

    });




  }

  addAtendeesToggle:boolean=false;

  toggleAddAtendees(){
    this.addattEmail = "";
    this.addattName = "";
    this.addattPhone = "";
    this.addAtendeesToggle=true;
  }


  discardAtt(){
    this.addattEmail = "";
    this.addattName = "";
    this.addattPhone = "";

    this.addAtendeesToggle=false;
  }

  addAttendees(){
    let newAtt :atendees  = {
      name : this.addattName,
      email:this.addattEmail,
      phone:this.addattPhone,
    }

    this.addedatendees.push(newAtt);

    

    this.addedattEmail.push(this.addattEmail);
    this.addedattName.push(this.addattName);
    this.addedattPhone.push(this.addattPhone);


    this.addAtendeesToggle = false;
  }

  removeAddedAtt(index:any){
    this.addedatendees.splice(index,1);
  }

  removeExistingAtt(index:any){
    let allAtendees = [...this.atendees]

    allAtendees.splice(index,1);

    

    this.atendees = allAtendees;


  }


  removeLocation(location:any,locationIndex:any,dayIndex:any){

    let currentdaylocations = [...this.allDayLocations[dayIndex]];

    currentdaylocations.splice(locationIndex,1);

    this.allDayLocations.splice(dayIndex,1);

    this.allDayLocations.splice(dayIndex,0,currentdaylocations);
  }

  addLocation(dayIndex:any){
    let currentdaylocations = [...this.allDayLocations[dayIndex]];
    currentdaylocations.push(this.dayLocation[dayIndex]);
    this.allDayLocations.splice(dayIndex,1);
    this.allDayLocations.splice(dayIndex,0,currentdaylocations);
  }


  toDoTaskEdited(todoIndex:any,dayIndex:any){
    
    let currentDaytoDo =   [...this.allDaytoDo[dayIndex]]

      let toDo :todo = {
      task : this.dayTodoTask[dayIndex][todoIndex],
      isCompleted : this.dayTodoStatus[dayIndex][todoIndex],
    }

    currentDaytoDo.splice(todoIndex,1,toDo);
    this.allDaytoDo.splice(dayIndex,1,currentDaytoDo);
    

  }

  toDoToggle :boolean[] = [] ;

  toggleToDo(dayIndex:any){
    this.toDoToggle[dayIndex] =true;
  }

  discardtoDo(dayIndex:any){
    this.toDoToggle[dayIndex] =false;
  }

  addtoDoTask:string[]=[];

  addtoDoStatus:boolean[]=[];

  addedtoDo : todo[][] = [];


  addtoDo(dayIndex:any){

    let toDo = {
      task : this.addtoDoTask[dayIndex],
      isCompleted : this.addtoDoStatus[dayIndex],

    }

    let currentDaytoDo =   [...this.allDaytoDo[dayIndex]]

    

    currentDaytoDo.push(toDo);

    this.allDaytoDo.splice(dayIndex,1,currentDaytoDo);

    let currentDaytoDoTasks = [...this.dayTodoTask[dayIndex]]

    currentDaytoDoTasks.push(this.addtoDoTask[dayIndex]);

    this.dayTodoTask.splice(dayIndex,1,currentDaytoDoTasks);

    let currentDaytoDoStatus = [...this.dayTodoStatus[dayIndex]]



    currentDaytoDoStatus.push(this.addtoDoStatus[dayIndex]);

    this.dayTodoStatus.splice(dayIndex,1,currentDaytoDoStatus);

    this.addtoDoTask[dayIndex] = ""
    this.addtoDoStatus[dayIndex] = false;

    this.toDoToggle[dayIndex] = false;

  }

  removeExistingtoDo(dayindex:any,todoindex:any){
    let currentdaytodo = [...this.allDaytoDo[dayindex]];
    

    currentdaytodo.splice(todoindex,1);

    

    this.allDaytoDo.splice(dayindex,1,currentdaytodo);
  }


  warningToggle : boolean[]  = [];

  togglWarning(dayIndex:any){
    this.warningToggle[dayIndex] = true;
  }

  closeWarning(dayIndx:any){
    this.warningToggle[dayIndx] = false;
  }


  deleteDay(dayIndex:any){

    
    let days = [...this.days]
    days.splice(dayIndex,1);
    this.days =days;
    
    this.dayDate.splice(dayIndex,1);
    
    this.dayLocation.splice(dayIndex,1);
    
    this.allDayLocations.splice(dayIndex,1);
    
    this.allDaytoDo.splice(dayIndex,1);
    
    this.dayTodoTask.splice(dayIndex,1);
    
    this.dayTodoStatus.splice(dayIndex,1);

    this.warningToggle[dayIndex] = false;
  }

  addDayToggle:boolean=false;

  toggleAddDay(){
    this.addDayToggle = true;
  }


  
  addDate! : string;
  addNotes!:string;
  addNewDateLocation! : string ;

  addTaskInNewDay! : string
  addStatusInNewDay! : boolean ;

  locationArrayInNewDate : string[] =[];
  
  toDoAddedInNewDay : todo[] = [];
  toDoTaskAddedInNewDay : string[] = [];
  todoStatusAddedInNewDay : boolean[] = [];


  addLocationInAddDay(){
    this.locationArrayInNewDate.push(this.addNewDateLocation);
    this.addNewDateLocation="";
  }

  removeLocationInNewDay(index:any){
    this.locationArrayInNewDate.splice(index,1);
  }

  addtoDoInNewDay(){
    let toDo : todo  = {
      task : this.addTaskInNewDay,
      isCompleted : this.addStatusInNewDay
    }
    this.toDoAddedInNewDay.push(toDo);

    this.toDoTaskAddedInNewDay.push(toDo.task);
    this.todoStatusAddedInNewDay.push(toDo.isCompleted);
  }

  removetoDoInNewDay(toDoIndex : any){
    this.toDoAddedInNewDay.splice(toDoIndex,1);

  }

  toDoTaskEditedInNewDay(toDoIndex:any){
    let toDo : todo = {
      task : this.toDoTaskAddedInNewDay[toDoIndex],
      isCompleted : this.todoStatusAddedInNewDay[toDoIndex]
    }

    this.toDoAddedInNewDay.splice(toDoIndex,1,toDo);
  }


  discardDay(){
    this.addDate = "";
    this.addNotes="";
    this.addNewDateLocation = "";
    this.addTaskInNewDay = ""
    this.addStatusInNewDay=false
    this.locationArrayInNewDate = [];
    this.toDoAddedInNewDay=[];
    this.toDoTaskAddedInNewDay=[]
    this.todoStatusAddedInNewDay=[]
    this.addDayToggle=false;

  }



  addDay(){
    
    let days = [...this.days];

    let newDay : days = {
      date : this.addDate,
      location : this.locationArrayInNewDate,
      toDo: this.toDoAddedInNewDay,
      notes:this.addNotes,
    }

    

    days.push(newDay);
    

    this.days =days;

    this.dayDate.push(newDay.date);
    this.dayNotes.push(newDay.notes);
    this.allDayLocations.push(newDay.location);
    this.allDaytoDo.push(newDay.toDo);

    let taskArray :string[] = []
    let statusArray : boolean[] = []

    for(let i=0;i<newDay.toDo.length;i++){
      taskArray.push(newDay.toDo[i].task);
      statusArray.push(newDay.toDo[i].isCompleted)
    }

    this.dayTodoTask.push(taskArray);
    this.dayTodoStatus.push(statusArray);

    this.discardDay();

  }

  saveTrip(){

    let tripName =  this.tripNameInput;
    let tripLocation = this.tripLocationInput;

    

    let tripAttendees : atendees[] = [];

    for(let i=0;i<this.atendees.length;i++){
       let tripAtt : atendees = {
        name : this.attName[i],
        phone : this.attPhone[i],
        email : this.attEmail[i]
       }

       tripAttendees.push(tripAtt);
    }

    for(let i=0;i<this.addedatendees.length;i++){
      tripAttendees.push(this.addedatendees[i]);
    }

    

    for(let i=0;i<this.allDaytoDo.length;i++){
      let currentToDo = [...this.allDaytoDo[i]]


      for(let j=0;j<currentToDo.length;j++){

        if(currentToDo[j].isCompleted==undefined ||currentToDo[j].isCompleted==false )
        {
          let todo:todo = {
            task : currentToDo[j].task,
            isCompleted:false
          }

          currentToDo.splice(j,1,todo);
        }
        else{
          let todo:todo = {
            task : currentToDo[j].task,
            isCompleted:true
          }
          currentToDo.splice(j,1,todo);
        }

        

        this.allDaytoDo.splice(i,1,currentToDo);


      }



    }


    let alldays:days[] =[]

    for(let i=0;i<this.days.length;i++){
      let day : days = {
        date : this.dayDate[i],
        location : this.allDayLocations[i],
        toDo : this.allDaytoDo[i],
        notes:this.dayNotes[i],
      }

      alldays.push(day);

    }

    

    let editedtrip = {
      userId : localStorage.getItem("accesstokenid"),
      tripName : this.tripNameInput,
      tripLocation : this.tripLocationInput,
      atendees : tripAttendees,
      days : alldays,

    }

    

    this.apollo.mutate({
      mutation:editTrip,
      variables:{
        tripid : this.tripId,
        tripData : editedtrip
      }

    }).subscribe(res=>{
      
      location.href = "/trip-overview/"+this.tripId;
    })

  }

}
