import { Component,OnInit } from '@angular/core';

import { Milestone } from './milestone';
import { MilestoneService } from './milestones.service';
import { CHECKLIST } from './checklist';

import { AchReport } from './report';
import { Report } from './report';

import { Router,
         NavigationExtras,ActivatedRoute, Params } from '@angular/router';
import { AuthService }      from '../auth.service';
import { AngularFire, FirebaseListObservable,AuthProviders, AuthMethods } from 'angularfire2';

@Component({
    
  //   </nav>
  //   <router-outlet></router-outlet>

  //   <button md-button>FLAT</button>
  // `,
  template:  `

 


<md-sidenav-layout [class.m2app-dark]="isDarkTheme">

  <md-sidenav #sidenav mode="side" class="app-sidenav" style="background: #4A90E2;
  color: black">

    <div align = "center"><button  md-raised-button  (click)="sidenav.close()">
      Back
    </button>
  </div>

  <md-nav-list >
  
    <md-divider></md-divider>
    <md-list-item routerLink="./checklist" routerLinkActive="active"
    [routerLinkActiveOptions]="{ exact: true }" (click)="sidenav.close()">Checklist  ({{tempReport.numAchieved}}/34)</md-list-item>
    <md-divider></md-divider>
    <md-list-item routerLink="./story" routerLinkActive="active" (click)="sidenav.close()">Storybook</md-list-item>
    <md-divider></md-divider>
    <md-list-item routerLink="./settings" routerLinkActive="active"
    [routerLinkActiveOptions]="{exact: true}" (click)="sidenav.close()">Settings</md-list-item>
    <md-divider></md-divider>
  </md-nav-list>
</md-sidenav>

<md-toolbar style="background:white">

  <button  md-raised-button (click)="sidenav.open()">
    Menu
  </button>

  &nbsp; Amazing Me

  <span class="app-toolbar-filler"></span>
  Hi, Bridget
  <button md-raised-button align = "right" (click)="logout()"  >Logout</button>
</md-toolbar>

<div style="background:white">

 

  <router-outlet></router-outlet>
</div>

</md-sidenav-layout>


  `,
  // templateUrl: './home.html',
  styleUrls: ['./app.component.css']
})
export class AccountComponent {


  constructor( 
    private milestoneService: MilestoneService,  
    public af: AngularFire, 
    public authService: AuthService, 
    public router: Router
  ) {


    this.af.auth.subscribe(auth => console.log(auth));
  }

  logout() {
     this.af.auth.logout();
     this.authService.logout()

    let redirect = this.authService.redirectUrl ? this.authService.redirectUrl : 'login';
    let navigationExtras: NavigationExtras = {
          preserveQueryParams: true,
          preserveFragment: true
        };

        // Redirect the user
     this.router.navigate([redirect], navigationExtras);

   
     // this.authService.logout();
  }


  checklist = CHECKLIST;
  //dialogRef: MdDialogRef<MilestoneDetailComponent>;
  //lastCloseResult: string;
  public selectedMilestone: Milestone;
  public result: any;
  public tempReport: Report = AchReport;
public checklistLength: number = 34;

 public getReport(): Promise<Report> {
    
    return Promise.resolve(AchReport);
  }
  public reportUpdate(report:Report): void {
    this.countUpdateIteration().then(tempReport => report = tempReport);
  }

  public countUpdateIteration(): Promise<Report> {
    this.tempReport = {
      numRecord: 0,
      numAchieved: 0,
      numPhotos: 0
    };

    for (let index = 0; index < this.checklistLength; index++) {
      this.milestoneService.getMilestone(index).then(milestone => this.countUpdate(milestone));
    }
    
    return Promise.resolve(this.tempReport);
  }

  public countUpdate(milestone:Milestone): Promise<Report> {
    if (milestone.progress > 0 ) {
      this.tempReport.numRecord += 1;
    }
    if (milestone.progress == 10 ) {
      this.tempReport.numAchieved += 1;
    }
    if (milestone.progress > 0 ) {
      this.tempReport.numPhotos += 1;
    }
    return Promise.resolve(this.tempReport);
  }


ngOnInit(): void {
 
    this.getReport().then(AchReport => this.reportUpdate(AchReport)); 
    
  }


  
 
  

}


/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/