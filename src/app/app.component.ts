import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from "./components/footer/footer.component";
import { LoaderComponent } from "./components/loader/loader.component";
import { StorageService } from './services/storage.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, RouterModule, LoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'thinner-mart';
  constructor(private storageService: StorageService) { }
  ngOnInit() {
    if (!this.storageService.getItem('cart')) {
      let emptyCart: any = []
      this.storageService.setItem('cart', JSON.stringify(emptyCart))
    }
  }
}
