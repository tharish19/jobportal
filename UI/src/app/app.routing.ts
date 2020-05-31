import { Routes } from '@angular/router';

import { CommonLayoutComponent } from './common/common-layout.component';
import { JobsComponent } from './jobs/jobs.component';
import { OAuthCallbackComponent } from './login-callback/oauth-callback.component';
import { SignInComponent } from './login-callback/sign-in/sign-in.component';
import { AuthenticationGuard } from './shared/services/authenticated.guard';
import { OAuthCallbackHandler } from './shared/services/oauth-callback.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { JobSearchDataComponent } from './jobsearchdata/job-search-data.component';

// Layouts
export const AppRoutes: Routes = [
    {
        path: '',
        component: CommonLayoutComponent,
        children: [
            {
                path: '',
                component: DashboardComponent,
                canActivate: [AuthenticationGuard]
            },
            {
                path: 'login',
                component: SignInComponent,
            },
            {
                path: 'dashboard',
                component: DashboardComponent,
                canActivate: [AuthenticationGuard]
            },
            {
                path: 'jobs',
                component: JobsComponent,
                canActivate: [AuthenticationGuard],
                data: {
                    title: 'Grid Table'
                },
            },
            {
                path: 'jobsearchdata',
                component: JobSearchDataComponent,
                canActivate: [AuthenticationGuard]
            },
            { path: 'id_token', component: OAuthCallbackComponent, canActivate: [OAuthCallbackHandler] }
        ]
    }

];

