import { Component, ElementRef } from '@angular/core';
import { LayoutService } from '../../../shared/services/layout.service';

@Component({
  selector: 'dashboard-sidebar',
  templateUrl: './dashboard-sidebar.component.html',
  styleUrl: './dashboard-sidebar.component.scss',
})
export class DashboardSidebarComponent {
  constructor(public layoutService: LayoutService, public el: ElementRef) {}
}
