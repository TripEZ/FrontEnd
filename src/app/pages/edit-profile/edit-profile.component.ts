import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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

const editUser = gql`
  mutation editUserInfo($userId:String!,$name:String!,$phone:String!)
  {
    editUserInfo(userId:$userId,userInput:{name:$name,phone:$phone})
  }
  `;

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  user:any={
    name:'',
    email:'',
    phone:''
  }

  editForm = new FormGroup({
    name : new FormControl('',[Validators.required]),
    email : new FormControl('',[Validators.required,Validators.email]),
    phone : new FormControl('')
  });

  constructor(private apollo:Apollo, private router:Router) { }

  ngOnInit(): void {
    this.apollo.mutate<userResponse>({
      mutation:getUser,
      variables:{
        Id : localStorage.getItem("accesstokenid")
      }
    }).subscribe(res=>{
      this.editForm.controls.name.setValue(res.data?.getUserById.name!);
      this.editForm.controls.email.setValue(res.data?.getUserById.email!);
      this.editForm.controls.phone.setValue(res.data?.getUserById.phone!);
    })
  }

  saveChanges(){
    this.apollo.mutate({
      mutation:editUser,
      variables:{
        userId:localStorage.getItem("accesstokenid"),
        name:this.editForm.controls.name.value,
        phone:this.editForm.controls.phone.value.toString(),
      }
    }).subscribe(res=>{
      this.router.navigateByUrl("/profile")
    });

  }

  goBack(){
    this.router.navigateByUrl('profile');
  }
}
