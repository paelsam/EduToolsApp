import { Component } from '@angular/core';
import { DataView } from 'primeng/dataview';

@Component({
  selector: 'shop-produts-container',
  templateUrl: './shop-produts-container.component.html',
  styleUrl: './shop-produts-container.component.scss'
})
export class ShopProdutsContainerComponent {
  constructor() {}

  onFilter(dv: DataView, event: any) {
    console.log('Filtering products');
  }

  onSortChange(event: any) {
    console.log('Sorting products');
  }
}
