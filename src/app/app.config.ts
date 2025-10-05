import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideTranslateLoader, provideTranslateService, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { provideTranslateHttpLoader, TranslateHttpLoader } from '@ngx-translate/http-loader';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideClientHydration(withEventReplay()), providePrimeNG({ theme: { preset: Aura } }), provideHttpClient(withInterceptors([AuthInterceptor])), provideToastr({
    positionClass: 'toast-top-center',
    preventDuplicates: false,
    progressBar: true,
    closeButton: false,
  }),
  provideAnimations(),
  provideTranslateService({
    fallbackLang: 'en',
    loader: provideTranslateHttpLoader({
      prefix: '/assets/i18n/',
      suffix: '.json'
    })
  })
    // importProvidersFrom(
    //   TranslateModule.forRoot({
    //     loader: {
    //       provide: TranslateLoader,
    //       useFactory: HttpLoaderFactory,
    //       deps: [HttpClient],
    //     },
    //   }))
  ]
};
