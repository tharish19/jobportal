import { Routes } from '@angular/router';

import { CommonLayoutComponent } from './common/common-layout.component';
import { JobsComponent } from './jobs/jobs.component';
import { OAuthCallbackComponent } from './login-callback/oauth-callback.component';
import { SignInComponent } from './login-callback/sign-in/sign-in.component';
import { AuthenticationGuard } from './shared/services/authenticated.guard';
import { dataFilterResolver } from './shared/services/dataFilterResolver';
import { OAuthCallbackHandler } from './shared/services/oauth-callback.guard';

// Layouts
export const AppRoutes: Routes = [


    {
        path: '',
        component: CommonLayoutComponent,
        children: [

            {
                path: '',
                component: JobsComponent,
                resolve: {
                    dataFilter: dataFilterResolver
                },
                canActivate: [AuthenticationGuard],
                data: {
                    title: 'Grid Table'
                },

            },
            {
                path: 'login',
                component: SignInComponent,

            },
            { path: 'id_token', component: OAuthCallbackComponent, canActivate: [OAuthCallbackHandler] }

        ]
    }

];

