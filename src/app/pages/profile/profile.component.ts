import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';

interface userResponse{
  getUserById:{ 
    name : string;
    email:string;
    phone:string;  
  };
}

const getUser=gql`
  mutation getUserById($Id:String!){
    getUserById(Id:$Id){
      name
      email
      phone
    }
  }
`;
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user:any={
    name:'',
    email:'',
    phone:''
  }

  constructor(private apollo:Apollo, private router:Router) { }

  ngOnInit(): void {
    this.apollo.mutate<userResponse>({
      mutation:getUser,
      variables:{
        Id : localStorage.getItem("accesstokenid")
      }
    }).subscribe(res=>{
      this.user.name = res.data?.getUserById.name!;
      this.user.email = res.data?.getUserById.email!; 
      this.user.phone = res.data?.getUserById.phone!; 
    })

    
  }

  edit(){
    this.router.navigateByUrl('editprofile');
  }

}
