import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ColumnInfoService, ColumnResizingService, GridModule } from '@progress/kendo-angular-grid';
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { AppMaterialModule } from './app-material.module';
import { AppComponent } from './app.component';
import { AppRoutes } from './app.routing';
import { CommonLayoutComponent } from './common/common-layout.component';
import { JobsComponent } from './jobs/jobs.component';
import { OAuthCallbackComponent } from './login-callback/oauth-callback.component';
import { SignInComponent } from './login-callback/sign-in/sign-in.component';
import { NoRightClickDirective } from './shared/directives/no-right-click.directive';
import { AdminInterceptor } from './shared/services/admin.interceptor';
import { TemplateService } from './shared/services/template.service';
import { SharedModule } from './shared/shared.module';
import { SideNavComponent } from './template/side-nav/side-nav.component';
import { SidePanelComponent } from './template/side-panel/side-panel.component';
import { TemplateModule } from './template/template.module';
import { DateAgoPipe } from './shared/pipes/date-ago.pipe';


// import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// export function HttpLoaderFactory(httpClient: HttpClient) {
//     return new TranslateHttpLoader(httpClient);
//   }

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: false
  };

@NgModule({
    exports: [
        PerfectScrollbarModule,
        GridModule,
        AppMaterialModule,
        DateAgoPipe
    ],
    imports: [PerfectScrollbarModule],
    declarations: [DateAgoPipe],
    providers: [{
    provide: PERFECT_SCROLLBAR_CONFIG,
    useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
  } ]
  })
  export class CommonExternalModules { }


@NgModule({
    imports: [
        BrowserModule,
        RouterModule.forRoot(AppRoutes, { useHash: true }),
        SharedModule,
        CommonModule,
        BrowserAnimationsModule,
        TemplateModule,
        HttpClientModule,
        CommonExternalModules,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        AppComponent,
        SignInComponent,
        JobsComponent,
        CommonLayoutComponent,
        OAuthCallbackComponent,
        NoRightClickDirective,
        SideNavComponent,
        SidePanelComponent
    ],
     providers: [{
            provide: HTTP_INTERCEPTORS,
            useClass: AdminInterceptor,
            multi: true
        },  ColumnResizingService,
        ColumnInfoService,
         TemplateService],
    bootstrap: [AppComponent]
})


export class AppModule { }
