import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

interface MenuItemSubmenu {
  title: string;
  route: string;
  icon?: string;
}

interface MenuItem {
  title: string;
  route?: string;
  icon: string;
  submenu?: MenuItemSubmenu[];
  expanded?: boolean;
}

@Component({
    selector: 'app-sidebar',
    imports: [
        CommonModule,
        RouterLink,
        RouterLinkActive,
        LucideAngularModule // Mantenha isso para que o template reconheça <lucide-icon>
    ],
    templateUrl: `./sidebar.component.html`,
    styleUrls: [`./sidebar.component.css`]
})
export class SidebarComponent {
  menuItems: MenuItem[] = [
    // Usamos os nomes dos ícones em "kebab-case" (tudo minúsculo e separado por traço)
    { title: 'Dashboard', route: '/dashboard', icon: 'layout-dashboard' },
    { title: 'Tasks', route: '/kanban', icon: 'trello' },
    { title: 'Clientes', route: '/clients', icon: 'users' },
    { title: 'Serviços/Produtos', route: '/services', icon: 'briefcase' },
    { title: 'Categorias', route: '/categories', icon: 'tag' },
    { title: 'Propostas', route: '/proposals', icon: 'clipboard' },
    { title: 'Templates', route: '/templates', icon: 'file-text' },
    { title: 'Histórico', route: '/history', icon: 'history' },
    { title: 'Perfil', route: '/profile', icon: 'user' },
  ];

  toggleSubmenu(item: MenuItem): void {
    if (item.submenu) {
      item.expanded = !item.expanded;
    }
  }
}