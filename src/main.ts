import { enableProdMode, importProvidersFrom } from '@angular/core'
import { bootstrapApplication } from '@angular/platform-browser'
import { RouteReuseStrategy, provideRouter } from '@angular/router'
import { IonicModule, IonicRouteStrategy } from '@ionic/angular'
import { routes } from './app/app.routes'
import { AppComponent } from './app/app.component'
import { environment } from './environments/environment'
import { provideAnalytics, getAnalytics } from '@angular/fire/analytics'
import { initializeApp, provideFirebaseApp } from '@angular/fire/app'
import { getFirestore, provideFirestore } from '@angular/fire/firestore'

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    importProvidersFrom(IonicModule.forRoot({})),
    importProvidersFrom(provideFirebaseApp(() => initializeApp(environment.firebase))),
    importProvidersFrom(provideFirestore(() => getFirestore())),
    importProvidersFrom(provideAnalytics(() => getAnalytics())),
    provideRouter(routes),
  ]
});
