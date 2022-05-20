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
import { EdgesComponent } from './pages/graph-tool/components/edges/edges.component';
import {environment} from "../environments/environment";
import {StoreDevtoolsModule} from "@ngrx/store-devtools";
import {ParserDisplayComponent} from "./pages/parser/components/parser-display/parser-display.component";
import {FormsModule} from "@angular/forms";
import { ConstrainComponent } from './pages/graph-tool/components/constrain/constrain.component';
import { NonTerminalNodeComponent } from './pages/graph-tool/components/node/non-terminal-node/non-terminal-node.component';
import { EndNodeComponent } from './pages/graph-tool/components/node/end-node/end-node.component';
@NgModule({
  declarations: [
    AppComponent,
    DisplayComponent,
    NodeComponent,
    EdgesComponent,
    ParserDisplayComponent,
    ConstrainComponent,
    NonTerminalNodeComponent,
    EndNodeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StoreModule.forRoot({app: appReducer}),
    EffectsModule.forRoot([AppEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
