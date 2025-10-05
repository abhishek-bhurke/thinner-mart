import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  constructor(private translate: TranslateService, private storageService: StorageService) {
    this.translate.addLangs(['en', 'hi']);
    const savedLang = this.storageService.getItem('app_lang') || 'en';
    this.useLang(savedLang);
  }

  useLang(lang: string) {
    this.translate.use(lang);
    this.storageService.setItem('app_lang', lang);
  }

  getCurrentLang(): string {
    return this.translate.currentLang || 'en';
  }
}
