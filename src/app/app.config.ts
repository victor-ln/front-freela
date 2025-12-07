import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { jwtInterceptor } from './core/interceptors/jwt.interceptor';

import {
  LucideAngularModule,
  LayoutDashboard,
  Users,
  Briefcase,
  Tag,
  FileText,
  Clipboard,
  Trello,
  User,
  ChevronDown,
  History,
} from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([jwtInterceptor])),

    importProvidersFrom(
      LucideAngularModule.pick({
        LayoutDashboard,
        Users,
        Briefcase,
        Tag,
        FileText,
        Clipboard,
        Trello,
        User,
        ChevronDown,
        History,
      })
    ),
  ],
};
