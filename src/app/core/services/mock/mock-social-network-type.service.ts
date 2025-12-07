import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MockStorageService } from './mock-storage.service';
import { SocialNetworkTypeResponseDto } from '../../dto/social-network-type.dto';

@Injectable({
  providedIn: 'root'
})
export class MockSocialNetworkTypeService {
  private readonly ENTITY = 'social_network_types';

  constructor(private storage: MockStorageService) {
    this.initializeDefaultData();
  }

  private initializeDefaultData(): void {
    const defaultTypes: SocialNetworkTypeResponseDto[] = [
      {
        id: 1,
        tipo: 'Instagram',
        descricao: 'Rede social de fotos e vídeos',
        icone: 'instagram',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        tipo: 'Facebook',
        descricao: 'Rede social principal',
        icone: 'facebook',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        tipo: 'LinkedIn',
        descricao: 'Rede social profissional',
        icone: 'linkedin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        tipo: 'Twitter/X',
        descricao: 'Microblog',
        icone: 'twitter',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 5,
        tipo: 'TikTok',
        descricao: 'Vídeos curtos',
        icone: 'tiktok',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 6,
        tipo: 'YouTube',
        descricao: 'Plataforma de vídeos',
        icone: 'youtube',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 7,
        tipo: 'Pinterest',
        descricao: 'Rede de inspiração visual',
        icone: 'pinterest',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 8,
        tipo: 'WhatsApp Business',
        descricao: 'Mensageiro empresarial',
        icone: 'whatsapp',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    this.storage.initializeIfEmpty(this.ENTITY, defaultTypes);
  }

  findAll(): Observable<SocialNetworkTypeResponseDto[]> {
    const types = this.storage.get<SocialNetworkTypeResponseDto>(this.ENTITY);
    return of(types).pipe(delay(300));
  }

  findOne(id: number): Observable<SocialNetworkTypeResponseDto | null> {
    const type = this.storage.findById<SocialNetworkTypeResponseDto>(this.ENTITY, id);
    return of(type).pipe(delay(300));
  }
}
