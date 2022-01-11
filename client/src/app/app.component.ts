import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { User } from './_models/user';
import { AccountService } from './_services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'The Dating App';
  users:any;

  constructor(private http: HttpClient, private accountServer:AccountService){}
  ngOnInit() {
    this.getUsers();
    this.setCurrentUser();
  }

  setCurrentUser(){
    const userlocal = localStorage.getItem('user');
    if(userlocal){
      const user = JSON.parse(userlocal);
      this.accountServer.setCurrentUser(user);
    }
  }
  getUsers(){
    this.http.get('https://localhost:5001/api/users').subscribe(response =>{
      this.users = response
    }, error =>{
      console.log(error);
    });
  }
  
  
}
