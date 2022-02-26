import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import moment from 'moment';


@Component({
  selector: 'app-weather-widget',
  templateUrl: './weather-widget.component.html',
  styleUrls: ['./weather-widget.component.css']
})
export class WeatherWidgetComponent implements OnInit {

  @Input()
  location!:string;

  @Input()
  date!:string;

  weatherData:any;

  temp:any;
  condition:any;

  historical :string = "";

  constructor(private http:HttpClient) { }

  ngOnInit(): void {

    var daysDifference = this.historicalOrWeather();

    

      if(daysDifference<16){
      this.http.get<any>("https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/weatherdata/forecast?locations="+ this.location+"&aggregateHours=24&unitGroup=metric&shortColumnNames=false&contentType=json&key=AUBJH8JKJ45Y8KQGL2RB96P5H").subscribe(res=>{

        this.weatherData = Object.values(res.locations)[0];

        this.weatherData = this.weatherData.values;

        

        this.temp = Math.round(Number(this.weatherData[daysDifference].temp));

        this.condition = this.weatherData[daysDifference].conditions;
      });

    }
    else{

      var date = new Date(this.date);

      date.setMonth(date.getMonth()-12);



      var historicalDate =  moment(new Date(date.getTime() + (1000 * 60 * 60 * 24))).format().toString().slice(0,10)

      

      this.historical = "From Historical Data : "


      this.http.get<any>("https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/weatherdata/history?aggregateHours=24&combinationMethod=aggregate&startDateTime="+historicalDate +"&endDateTime="+historicalDate +"&maxStations=-1&maxDistance=-1&contentType=json&unitGroup=metric&locationMode=single&key=AUBJH8JKJ45Y8KQGL2RB96P5H&dataElements=default&locations="+this.location)
      .subscribe(res=>{
        

        this.temp =  Math.round(Number(res.location.values[0].temp));
        this.condition = res.location.values[0].conditions;
      })

    }
  }


  historicalOrWeather(){
    var currentDate = new Date();
    var currentDateString  = moment(currentDate).format().toString().slice(0,10);

      var date1 = new Date(this.date);
      var date2 = new Date(currentDateString);
      var Time = date1. getTime() - date2. getTime();
      var Days = Time / (1000 * 3600 * 24);

      return Days;
    }
}


