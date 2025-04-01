import { Routes } from '@angular/router';
import { QuoteComponent } from './functions/quote/component/quote/quote.component';
import { DownloadComponent } from './functions/download/components/download/download.component';
import { AssetComponent } from './functions/asset/components/asset/asset.component';
import { HomeComponent } from './functions/dashboard/components/home/home.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'assets', component: AssetComponent },
    { path: 'download', component: DownloadComponent },
    { path: 'quotes', component: QuoteComponent },
  ];
