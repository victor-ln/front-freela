import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-social-network-types',
  standalone: true,
  imports: [CommonModule],
  templateUrl: `social-network-types.component.html`,
  styleUrl: `social-network-types.component.css`
})
export class SocialNetworkTypesComponent {
  mockTypes = [
    {
      name: 'Facebook',
      status: 'active',
      usage: 3
    },
    {
      name: 'Instagram',
      status: 'active',
      usage: 5
    },
    {
      name: 'LinkedIn',
      status: 'active',
      usage: 2
    },
    {
      name: 'Twitter',
      status: 'active',
      usage: 1
    },
    {
      name: 'TikTok',
      status: 'inactive',
      usage: 0
    }
  ];

  getTypeIcon(typeName: string): string {
    const icons: { [key: string]: string } = {
      'Facebook': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
      'Instagram': '<svg viewBox="0 0 24 24" fill="currentColor"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="m16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>',
      'LinkedIn': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>',
      'Twitter': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>',
      'TikTok': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 12a4 4 0 1 0 4 4V2a9 9 0 0 1 9 9"/></svg>'
    };
    
    return icons[typeName] || '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>';
  }
}