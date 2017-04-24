import { Component,ViewContainerRef ,OnInit} from '@angular/core';

import { Milestone } from './milestone';
import { MilestoneService } from './milestones.service';
// import { CHECKLIST } from './checklist';

import { AchReport } from './report';
import { Report } from './report';
// import {MdDialog, MdDialogRef, MdDialogConfig} from '@angular/material';
import { RatingModule } from 'ng2-bootstrap/ng2-bootstrap';

import {DialogsService} from './dialog.service';

import {AngularFire, FirebaseObjectObservable, FirebaseListObservable,AuthProviders, AuthMethods} from 'angularfire2';
import {Subject} from 'rxjs/Subject';

import * as jsPDF from 'jspdf';

@Component({
  // selector: 'pizza-component',
  template:  `

    <h2>&nbsp; Milestone Checklist </h2> 
<button  md-raised-button 
    (click)="download()">
    download
</button>

   <md-list>

   <md-list-item *ngFor="let item of checklist | async"  (click)="openDialog(item,noteUpdate)">
   

<span ><img src={{item.icon}} ></span> &nbsp; &nbsp; 
    
      {{item.name}} 
   &nbsp; &nbsp; 

<span *ngIf="item.progress>0">
     <span class="label"   
       [ngClass]="{'label-warning': item.progress<30, 'label-info': item.progress>=30 && item.progress<70, 'label-success': item.progress>=70}">
         {{item.progress}}% complete
     </span>
     </span>


   
        
    </md-list-item>

   
    </md-list>

    <router-outlet></router-outlet>
  `
})

 



export class ChecklistCenterComponent { 

 public noteUpdate:boolean = false;
 constructor(
   
  
    public af: AngularFire,
    // private router: Router,
    // private http: Http,
    // private pageService: PageService,
    private dialogsService: DialogsService,
    private milestoneService: MilestoneService,  
    private viewContainerRef: ViewContainerRef,
    

    ) {

    af.auth.subscribe(auth => {
      console.log(auth);
      this.userID = auth.uid;

    });


 this.userAccount = af.database.list('/userList',{
      query: {
        orderByChild: 'userID',
        equalTo: this.userID
      }
    });

    this.userAccount.subscribe(queriedItems => {
      this.key = queriedItems[0].$key;
      this.userChecklist = af.database.list('/userList/'+queriedItems[0].$key+'/Checklist/',{
        query: {
          orderByChild: 'progress',
        }
      });

       this.checklist = af.database.list('/userList/'+queriedItems[0].$key+'/Checklist/', {
        query: {
          orderByChild: 'id'
         
        }
      });


      this.checklistSubject = new Subject();
      this.checklistitem = af.database.list('/userList/'+queriedItems[0].$key+'/Checklist/', {
        query: {
          orderByChild: 'id',
          equalTo: this.checklistSubject
        }
      });

      this.checklistitem.subscribe(queriedItems => {

        // this.generateReport();

        console.log("selectedMilestone: ", queriedItems[0]);
        this.selectedMilestone = queriedItems[0];
        // this.defineStar(this.selectedMilestone);

        var templist1 = af.database.list('/userList/'+this.key+'/Checklist/', {
          query: {
            orderByChild: 'progress',
            equalTo: 0
          }
        });
        templist1.subscribe(queriedItems => {this.tempReport.numRecord = 34- queriedItems.length});

        var templist2 = af.database.list('/userList/'+this.key+'/Checklist/', {
          query: {
            orderByChild: 'progress',
            equalTo: 100
          }
        });
        templist2.subscribe(queriedItems => {this.tempReport.numAchieved = queriedItems.length});

      });

    });





  }

public openDialog(milestone:Milestone, noteUpdate:boolean) {
   var day = new Date();
    this.dialogsService
      .confirm(milestone, this.viewContainerRef)
      .subscribe(res => {
        this.result = res;
        this.userChecklist.update('Milestone'+ milestone.id, { progress: milestone.progress,notes: milestone.notes, 
          lastUpdate: day.toDateString() });
        if(milestone.submilestone.checkbox1) {
           this.userChecklist.update('Milestone'+milestone.id, {submilestone: {checkbox1: {state:milestone.submilestone.checkbox1.state,name:milestone.submilestone.checkbox1.name},checkbox2: {state:milestone.submilestone.checkbox2.state,name:milestone.submilestone.checkbox2.name},
          checkbox3: {state:milestone.submilestone.checkbox3.state,name:milestone.submilestone.checkbox3.name},checkbox4: {state:milestone.submilestone.checkbox4.state,name:milestone.submilestone.checkbox4.name}}});
        }
       

         let list = this.af.database.list('/userList/'+this.key+'/userLogs'+'/recordProgress');
        list.push({ time: Date(), name: milestone.name, progress: milestone.progress, type: "dialog", location:"checklist" });
        
        if (noteUpdate == true) {
          console.log("noteUpdated");
          let list2 = this.af.database.list('/userList/'+this.key+'/userLogs'+'/noteUpdate');
          list2.push({ time: Date(), name: milestone.name, progress: milestone.progress, updatedNotes: milestone.notes,location: "checklist"});
        }
      });

     


       let list = this.af.database.list('/userList/'+this.key+'/userLogs'+'/openDialog');
        list.push({ name: milestone.name, time: Date() ,location: "checklist"} );
  }


  // checklist = CHECKLIST;
  //dialogRef: MdDialogRef<MilestoneDetailComponent>;
  //lastCloseResult: string;
  // public selectedMilestone: Milestone;

  public result: any;
  public tempReport: Report = AchReport;
  public checklistLength: number = 34;

  public checklistitem: FirebaseListObservable<any[]>;
  public checklist: FirebaseListObservable<any[]>;
  public checklistSubject: Subject<any>;
  public selectedMilestone: any;
  public milestone: Milestone;
  public userChecklist: FirebaseListObservable<any[]>;

  public userID: any;
  public userAccount: FirebaseListObservable<any[]>;
  public key:any;

  public achievedArray: Array<any>;
  public progressingArray: Array<any>;


 public getReport(): Promise<Report> {
    
    return Promise.resolve(AchReport);
  }

  // public reportUpdate(report:Report): void {
  //   this.countUpdateIteration().then(tempReport => report = tempReport);
  // }

  // public countUpdateIteration(): Promise<Report> {
  //   this.tempReport = {
  //     numRecord: 0,
  //     numAchieved: 0,
  //     numPhotos: 0
  //   };

  //   for (let index = 0; index < this.checklistLength; index++) {
  //     this.milestoneService.getMilestone(index).then(milestone => this.countUpdate(milestone));
  //   }
    
  //   return Promise.resolve(this.tempReport);
  // }

  // public countUpdate(milestone:Milestone): Promise<Report> {
  //   if (milestone.progress > 0 ) {
  //     this.tempReport.numRecord += 1;
  //   }
  //   if (milestone.progress == 10 ) {
  //     this.tempReport.numAchieved += 1;
  //   }
  //   if (milestone.progress > 0 ) {
  //     this.tempReport.numPhotos += 1;
  //   }
  //   return Promise.resolve(this.tempReport);
  // }




  // public setMilestone(Number:number):void {
  //   this.milestoneService.getMilestone(Number).then(milestone => this.onSelect(milestone));
  // };

  // onSelect(milestone: Milestone): void {
   
   
  //   }

  public clickOn(milestone:Milestone, noteUpdate:boolean):void {
     this.checklistSubject.next(milestone.id);
     this.selectedMilestone = milestone;
    this.openDialog(milestone,noteUpdate);
    // this.milestoneService.getMilestone(milestone.id).then(milestone => this.onSelect(milestone));
    
  };

  // public key = new Promise((resolve, reject) => {

  //   this.userAccount = this.af.database.list('/userList',{
  //     query: {
  //       orderByChild: 'userID',
  //       equalTo: this.userID
  //     }
  //   });
  //   this.userAccount.subscribe(queriedItems => {
  //     this.key = queriedItems[0].$key;
  //     resolve(queriedItems[0].$key);
  //     console.log("key",queriedItems[0].$key);
  //   })
  // });


public queryChecklist()  {

  const key1 = new Promise((resolve, reject) => {

    this.userAccount = this.af.database.list('/userList',{
      query: {
        orderByChild: 'userID',
        equalTo: this.userID
      }
    });
    this.userAccount.subscribe(queriedItems => {
      this.key = queriedItems[0].$key;
      resolve(queriedItems[0].$key);
      console.log("key",queriedItems[0].$key);
    })
  });



    key1.then((res) =>{
      console.log("keywhenquery",res);
  
    var templist1 = this.af.database.list('/userList/'+res+'/Checklist/', {
      query: {
        orderByChild: 'progress',
        equalTo: 0
      }
    });
    templist1.subscribe(queriedItems => {this.tempReport.numRecord = 34- queriedItems.length});

    var templist2 = this.af.database.list('/userList/'+res+'/Checklist/', {
      query: {
        orderByChild: 'progress',
        equalTo: 100
      }
    });
    templist2.subscribe(queriedItems => {this.tempReport.numAchieved = queriedItems.length});

      
    });



    
    
  }

ngOnInit(): void {
   this.queryChecklist();
   this.generateReport();
    // this.getReport().then(AchReport => this.reportUpdate(AchReport)); 
    
  }

  // public openDialog(milestone:Milestone) {
  //   let config = new MdDialogConfig();
  //   config.viewContainerRef = this.viewContainerRef;
  //   this.dialogRef = this.dialog.open(MilestoneDetailComponent, config);
  //   this.dialogRef.afterClosed().subscribe(result => {
  //     this.lastCloseResult = result;
  //     this.dialogRef = null;
  //   });
  // }


//
  
  
  public generateReport() {

    const key1 = new Promise((resolve, reject) => {

    this.userAccount = this.af.database.list('/userList',{
      query: {
        orderByChild: 'userID',
        equalTo: this.userID
      }
    });
    this.userAccount.subscribe(queriedItems => {
      this.key = queriedItems[0].$key;
      resolve(queriedItems[0].$key);
      console.log("keyGR",queriedItems[0].$key);
    })
  });

    // key1.then((res) =>{

    //   console.log("generate Report");

    // var templist1 = this.af.database.list('/userList/'+res+'/Checklist/', {
    //   query: {
    //     orderByChild: 'progress',
    //     equalTo: 0
        
    //   }
    // });
    // templist1.subscribe(queriedItems => {
    //   this.tempReport.numRecord = 34-queriedItems.length;
    //   for (var i = this.tempReport.numAchieved; i <this.tempReport.numRecord; i++) {
    //     this.progressingArray[i] = (i+1).toString() + queriedItems[i].name;
    //     console.log("progressing",i);
    //   }
    // });

    // var templist2 = this.af.database.list('/userList/'+res+'/Checklist/', {
    //   query: {
    //     orderByChild: 'progress',
    //     equalTo: 100
    //   }
    // });
    // templist2.subscribe(queriedItems => {
    //   this.tempReport.numAchieved = queriedItems.length;
    //   for (var i = 0; i <queriedItems.length; i++) {
    //     this.progressingArray[i] = (i+1).toString() + queriedItems[i].name;
    //   }
    // });
      
    // });
    

    
  }

  public generatePDF() {

    var array:any[];

    var met = 45;
    var inProgress = met+ 10;
    


    const key1 = new Promise((resolve, reject) => {

      this.userAccount = this.af.database.list('/userList',{
        query: {
          orderByChild: 'userID',
          equalTo: this.userID
        }
      });
      this.userAccount.subscribe(queriedItems => {
        this.key = queriedItems[0].$key;
        resolve(queriedItems[0].$key);
        console.log("key",queriedItems[0].$key);
      })
    });

    key1.then((res) =>{

      var templist1 = this.af.database.list('/userList/'+res+'/Checklist/', {
        query: {
          orderByChild: 'progress',
          limitToLast:34

        }
      });
      templist1.subscribe(queriedItems => {
        var doc = new jsPDF();   
        doc.setFontSize(16);
        doc.text(20, 20, 'Milestone summary  4/7/2017');
        doc.line(20, 25, 200, 25);

        doc.setFontSize(16);
        doc.text(20, 35, 'George has progress in '+ this.tempReport.numRecord +'milestones!');

       
        // doc.text(20, 55, 'Milestones acchieved:');
        // doc.line(20, 57, 60, 57);
        doc.setFontSize(12);
        for (var i = queriedItems.length-1; i >0; i--) {
          if (queriedItems[i].progress>0) {
          var string1 = '#'+(queriedItems[i]).id +'  '+ queriedItems[i].name ;
          var string2 = "Confidence Level: "+ ' '+ (queriedItems[i].progress).toString() +'%' +'  '+queriedItems[i].lastUpdate;
          


          doc.text(20, met, string1);
          
          doc.text(30, met+7, string2);
          console.log("progressing",string1);
          met +=20;
          }
        }
        doc.save('Test.pdf');
      });

    });




    



    // inProgress = met+10;
    // doc.setFontSize(16);
    // doc.text(20, inProgress, 'In process milestones:');
    // doc.line(20, inProgress+3, 60, inProgress+3);

    // doc.setFontSize(12);
    // for (var i = this.tempReport.numAchieved; i <this.tempReport.numRecord; i++) {
      //   doc.text(20, inProgress+6, array[i]);
      //   inProgress +=5;
      // }

    }


  public download() {

    
        this.generatePDF();

   




  }

  
  }

// @Component({
//   selector: 'pizza-dialog',
//   template: `

//   <div *ngIf="selectedMilestone">

//         <img src= {{selectedMilestone.id}} >


//       </div>
//   <button type="button" (click)="dialogRef.close('yes')">Yes</button>
//   <button type="button" (click)="dialogRef.close('no')">No</button>
//   `
// })
// export class MilestoneDetailComponent {
//   constructor(public dialogRef: MdDialogRef<MilestoneDetailComponent>) { }
// }


/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license


*/