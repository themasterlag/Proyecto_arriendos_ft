import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { NexusInterceptor } from './interceptors/NexusInterceptor';


@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: NexusInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
