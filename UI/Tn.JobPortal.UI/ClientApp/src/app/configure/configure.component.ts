import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-configure',
  templateUrl: './configure.component.html',
  styleUrls: ['./configure.component.scss']
})
export class ConfigureComponent implements OnInit {

  constructor(private router: Router,
    private route: ActivatedRoute) {
    this.router.events.subscribe(evt => {
      if (evt instanceof NavigationEnd && this.route.children.length < 1) {
        this.router.navigate(['configure', { outlets: { ConfigureType: ['jobroles'] } }]);
      }
    });
  }

  ngOnInit() {
  }

}
