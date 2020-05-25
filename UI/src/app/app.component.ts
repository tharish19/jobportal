import { Component, HostBinding, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
    @HostBinding('class') public cssClass = 'DefaultClass';

    constructor() { }
    ngOnInit() {
        const html = document.getElementsByTagName('html')[0];
        if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
            html.classList.add('perfect-scrollbar-on');
        } else {
            html.classList.add('perfect-scrollbar-off');
        }
        // this.router.events.filter(event => event instanceof NavigationEnd).subscribe((_event: NavigationEnd) => {
        //     const body = document.getElementsByTagName('body')[0];
        //     const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
        //     if (body.classList.contains('modal-open')) {
        //       body.classList.remove('modal-open');
        //       modalBackdrop.remove();
        //     }
        // this.cssClass = 'DefaultClass';
        //   });
    }
    isMac(): boolean {
        let bool = false;
        if (navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.platform.toUpperCase().indexOf('IPAD') >= 0) {
          bool = true;
        }
        return bool;
      }

}
