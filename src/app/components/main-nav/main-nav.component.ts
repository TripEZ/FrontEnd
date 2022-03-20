import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalState } from '@apollo/client/core/LocalState';

import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

interface userResponse{
  getUserById:{ name : string;};
}



const getUser=gql`
  mutation getUserById($Id:String!){
    getUserById(Id:$Id){
      name
    }
  }
`;

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
})
export class MainNavComponent implements OnInit {

  constructor(private apollo:Apollo, private router:Router) { }

  name: string='';

  ngOnInit(): void {

    this.apollo.mutate<userResponse>({
      mutation:getUser,
      variables:{
        Id : localStorage.getItem("accesstokenid")
      }
    }).subscribe(res=>{this.name = res.data?.getUserById.name!})
  }

  logout(){
    localStorage.clear();
    this.router.navigateByUrl("/login");
  }

  openPrifile(){
    this.router.navigateByUrl('profile');
    this.toggleNav();
  }


  create(){
    this.router.navigateByUrl("/createTrip");
    this.toggleNav();
  }

  review(){
    this.router.navigateByUrl("/review");
    this.toggleNav();
  }

  navToggle :boolean = false;

  toggleNav(){
    if(this.navToggle == true){
      this.navToggle = false;
    }else{
      this.navToggle = true;
    }
  }

}
