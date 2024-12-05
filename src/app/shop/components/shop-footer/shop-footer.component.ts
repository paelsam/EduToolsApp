import { Component } from '@angular/core';
import { LayoutService } from '../../../shared/services/layout.service';
import { Router } from '@angular/router';

@Component({
  selector: 'shop-footer',
  templateUrl: './shop-footer.component.html',
  styleUrl: './shop-footer.component.scss'
})
export class ShopFooterComponent {


  constructor(public layoutService: LayoutService,
              public router: Router) {}
}
