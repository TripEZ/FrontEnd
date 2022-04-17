import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { title } from 'process';
import { filter } from 'rxjs/operators';
declare let gtag: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: []
  
})
export class AppComponent implements OnInit {
  title ='frontend';
  constructor(private router: Router) {
    
  }

  ngOnInit() {
      this.setUpAnalytics();
  }

  //Setup analytics for any event
  setUpAnalytics() {
      this.router.events.pipe(filter(event => event instanceof NavigationEnd))
          .subscribe((event: any) => {
              gtag('config', 'G-YOUR-GOOGLE-ID',
                  {
                      page_path: event.urlAfterRedirects
                  }
              );
          });
  }
}