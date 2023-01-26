import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Member } from 'src/app/_models/member';
import { User } from 'src/app/_models/user';
import { take } from 'rxjs/operators';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {

  @ViewChild('editForm') editForm: NgForm | undefined;
  @HostListener('window:beforeunload',['$event']) onUnload($event:any){
    if(this.editForm?.dirty){
      $event.returnValue=true;
    }
  }
  member:Member | undefined;
  user:User | null = null;
  constructor(private accountService: AccountService, private memberService: MembersService
    ,private toastrService: ToastrService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next:user => this.user = user
    })
   }

  ngOnInit(): void {
    this.loadMember();
  }

  loadMember(){
    if(!this.user) return;
    this.memberService.getMember(this.user.username).pipe(take(1)).subscribe({
      next:member => this.member = member
    })
  }
  updateMember(){
    this.memberService.updateMember(this.editForm?.value).subscribe(
      {
        next: _ => {
          this.toastrService.success("Profile updated successfully");
          this.editForm?.reset(this.member);
        }
      }
    )
    
  }
}
