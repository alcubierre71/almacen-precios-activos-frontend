import { Routes } from '@angular/router';
import { QuoteComponent } from './functions/quote/component/quote/quote.component';
import { DownloadComponent } from './functions/download/components/download/download.component';
import { AssetComponent } from './functions/asset/components/asset/asset.component';
import { HomeComponent } from './functions/dashboard/components/home/home.component';
import { NewAssetComponent } from './functions/asset/components/new-asset/new-asset.component';
import { MarketComponent } from './functions/market/components/market/market.component';
import { NewMarketComponent } from './functions/market/components/new-market/new-market.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'assets', component: AssetComponent },
    { path: 'assets/create', component: NewAssetComponent},
    { path: 'assets/update/:id', component: NewAssetComponent},
    { path: 'markets', component: MarketComponent },
    { path: 'markets/create', component: NewMarketComponent},
    { path: 'markets/update/:id', component: NewMarketComponent},
    { path: 'download', component: DownloadComponent },
    { path: 'quotes', component: QuoteComponent },
  ];
