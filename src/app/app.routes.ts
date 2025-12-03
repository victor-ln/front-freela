import { Routes } from '@angular/router';
import { FreelancerLayoutComponent } from './components/layouts/freelancer-layout/freelancer-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ClientsComponent } from './pages/clients/clients.component';
import { ServicesComponent } from './pages/services/services.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { TemplatesComponent } from './pages/templates/templates.component';
import { ProposalsComponent } from './pages/proposals/proposals.component';
import { KanbanComponent } from './pages/kanban/kanban.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { SocialNetworksComponent } from './pages/clients/social-networks/social-networks.component';
import { SocialNetworkTypesComponent } from './pages/clients/social-network-types/social-network-types.component';
import { HistoryComponent } from './pages/history/history.component';

// --- Importações de Autenticação ---
import { LoginComponent } from './auth/components/login/login.component';
import { RegisterComponent } from './auth/components/register/register.component';
import { ForgotPasswordComponent } from './auth/components/forgot-password/forgot-password.component';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // --- ROTAS PÚBLICAS (NÃO EXIGEM LOGIN) ---
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },

  // --- ROTAS PROTEGIDAS (EXIGEM LOGIN) ---
  {
    path: '',
    component: FreelancerLayoutComponent,
    canActivate: [AuthGuard], // O AuthGuard é aplicado aqui
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      {
        path: 'clients',
        component: ClientsComponent,
        children: [
          { path: 'social-networks', component: SocialNetworksComponent },
          { path: 'social-network-types', component: SocialNetworkTypesComponent }
        ]
      },
      { path: 'services', component: ServicesComponent },
      { path: 'categories', component: CategoriesComponent },
      { path: 'templates', component: TemplatesComponent },
      { path: 'proposals', component: ProposalsComponent },
      { path: 'kanban', component: KanbanComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'history', component: HistoryComponent },
    ]
  },
  // Rota de fallback para qualquer caminho não encontrado
  { path: '**', redirectTo: '' }
];