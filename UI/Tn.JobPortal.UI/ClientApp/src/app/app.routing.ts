import { Routes } from '@angular/router';

import { CommonLayoutComponent } from './common/common-layout.component';
import { JobsComponent } from './jobs/jobs.component';
import { OAuthCallbackComponent } from './login-callback/oauth-callback.component';
import { SignInComponent } from './login-callback/sign-in/sign-in.component';
import { AuthenticationGuard } from './shared/services/authenticated.guard';
import { OAuthCallbackHandler } from './shared/services/oauth-callback.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ConfigureComponent } from './configure/configure.component';
import { JobRolesDataComponent } from './configure/job-roles-list/job-roles-data.component';
import { ConsultantListComponent } from './configure/consultant-list/consultant-list.component';

// Layouts
export const AppRoutes: Routes = [
    {
        path: '',
        component: SignInComponent,
    },
    { path: 'id_token', component: OAuthCallbackComponent, canActivate: [OAuthCallbackHandler] },
    {
        path: '',
        component: CommonLayoutComponent,
        children: [
            {
                path: 'jobs',
                component: JobsComponent,
                canActivate: [AuthenticationGuard],
                data: {
                    title: 'Grid Table'
                },
            },
            {
                path: 'dashboard',
                component: DashboardComponent,
                canActivate: [AuthenticationGuard]
            },
            {
                path: 'configure',
                component: ConfigureComponent,
                canActivate: [AuthenticationGuard],
                children: [
                    {
                        path: '',
                        pathMatch: 'full',
                        redirectTo: 'jobroles'
                    },
                    {
                        path: 'jobroles',
                        component: JobRolesDataComponent,
                        outlet: 'ConfigureType'
                    },
                    {
                        path: 'consultants',
                        component: ConsultantListComponent,
                        outlet: 'ConfigureType'
                    }
                ]
            }
        ]
    }

];

