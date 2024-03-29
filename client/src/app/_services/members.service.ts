import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';

const httpOptions = {
  headers: new HttpHeaders({
    Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user') || '{}').token
  })
}
@Injectable({
  providedIn: 'root'
})

export class MembersService {

  members: Member[] = [];
  baseUrl=environment.apiUrl;
  constructor(private http:HttpClient) { }

  getMembers(){
    if(this.members.length > 0) return of(this.members);
    return this.http.get<Member[]>(this.baseUrl + '/users').pipe(
      map(members => {
        this.members = members;
        return members;
      }
      )
    );
  }

  getMember(username:string){
    const member = this.members.find(x=> x.userName === username);
    if(member !== null) return of(member);
    return this.http.get<Member>(this.baseUrl + '/users/' + username);
  }

  updateMember(member: Member){
    return this.http.put(this.baseUrl + '/users', member).pipe(
      map(()=>{
        const index = this.members.indexOf(member);
        this.members[index] = {...this.members[index],...member};
      })
    );
  }
}
