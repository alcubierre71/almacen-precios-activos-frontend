import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToolbarComponent } from '../../../shared/components/toolbar/toolbar.component';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterModule,
    ToolbarComponent,
    MatCardModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
