import { Component } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";
import { RouterLink } from '@angular/router';
import { GoogleMapsModule } from '@angular/google-maps';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-about-us',
  imports: [MatIconModule, RouterLink, GoogleMapsModule, TranslateModule],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss'
})
export class AboutUsComponent {
  constructor() { }
  // center: google.maps.LatLngLiteral = { lat: 19.1937449, lng: 73.0917526 };
  // zoom = 12;
  // options: google.maps.MapOptions = {
  //   mapTypeControl: false,
  // };

  // markers = [
  //   {
  //     position: { lat: 19.1937449, lng: 73.0917526 },
  //     label: { text: 'Hello' }
  //   },
  // ];
}
