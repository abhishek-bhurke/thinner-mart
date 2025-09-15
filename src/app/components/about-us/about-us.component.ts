import { Component } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about-us',
  imports: [MatIconModule, RouterLink],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss'
})
export class AboutUsComponent {

}
