import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from '../../../shared/services/layout.service';

@Component({
  selector: 'dashboard-top-bar',
  templateUrl: './dashboard-top-bar.component.html',
  styleUrl: './dashboard-top-bar.component.scss',
})
export class DashboardTopBarComponent {

  items!: MenuItem[];

  @ViewChild('menubutton') menuButton!: ElementRef;

  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

  @ViewChild('topbarmenu') menu!: ElementRef;

  constructor(public layoutService: LayoutService) {}
}
