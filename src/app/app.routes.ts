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

export const routes: Routes = [
  {
    path: '',
    component: FreelancerLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      {
        path: 'clients',
        component: ClientsComponent,
        children: [
          // Sub-rotas de clientes serão renderizadas dentro do ClientsComponent
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
  { path: '**', redirectTo: 'dashboard' }
];