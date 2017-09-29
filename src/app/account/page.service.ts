import { Page } from './page';
import { PAGES } from './pagelist';
import { Injectable } from '@angular/core';
import { AngularFireModule} from 'angularfire2';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class PageService {


  public pages: FirebaseListObservable<Page[]>;

  constructor(
    af: AngularFireDatabase,
    ) {

    this.pages= af.list('/Pagelist');
 
  };

  // getPages(id:number): Promise<FirebaseListObservable<Page[]>> {
    
  //   this.pages = this.af.database.list('/Pagelist', {
  //     query: {
  //       orderByChild: 'id',
  //        equalTo: id
        
  //     }
  //   };

 

  //   return Promise.resolve(this.pages);
  // }

  // getPage(id:number): Promise<Page> {


  //   this.getPages(id).then(pages=>this.page = pages[0]);
  //   return Promise.resolve(this.page);

  // }

  // getPagesSlowly(): Promise<Page[]> {
  //   return new Promise<Page[]>(resolve =>
  //     setTimeout(resolve, 2000)) // delay 2 seconds
  //     .then(() => this.getPages());
  // }

  // getPage(id: number): Promise<Page> {

  //   // return this.af.database.list('/Pagelist', {
  //   // query: {
  //   //   orderByChild: 'id',
  //   //   equalTo: id 
  //   // }
  //   // });
  //   // return this.getPages().then(pages => this.page = pages[id]);
  //   return this.getPages()
  //              .then(pages => pages.find(page => page.id === id));

  // }

  //  getPage(id: number): Page{


  //   return this.pages.find(page => page.id === id));

  // }
}
