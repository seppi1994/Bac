import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {appReducer} from "./store/app.reducers";
import {AppEffects} from "./store/app.effects";
import { DisplayComponent } from './pages/graph-tool/components/display/display.component';
import { NodeComponent } from './pages/graph-tool/components/node/node.component';
import { EdgeComponent } from './pages/graph-tool/components/edge/edge.component';

@NgModule({
  declarations: [
    AppComponent,
    DisplayComponent,
    NodeComponent,
    EdgeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StoreModule.forRoot({ app: appReducer }),
    EffectsModule.forRoot([AppEffects]),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
