import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

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
    provideHttpClient(),

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
    )
  ]
};