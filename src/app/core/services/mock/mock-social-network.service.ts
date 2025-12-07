import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MockStorageService } from './mock-storage.service';
import { SocialNetworkResponseDto, CreateSocialNetworkDto, UpdateSocialNetworkDto } from '../../dto/social-network.dto';
import { PaginatedResponseDto } from '../../../common/dto/pagination.dto';
import { ClientResponseDto } from '../../dto/client.dto';
import { SocialNetworksTypeResponseDto } from '../../dto/social-network-type.dto';

@Injectable({
  providedIn: 'root'
})
export class MockSocialNetworkService {
  private readonly ENTITY = 'social_networks';

  constructor(private storage: MockStorageService) {}

  create(createDto: CreateSocialNetworkDto): Observable<SocialNetworkResponseDto> {
    const clients = this.storage.get<ClientResponseDto>('clients');
    const types = this.storage.get<SocialNetworksTypeResponseDto>('social_network_types');

    const cliente = clients.find(c => c.id == createDto.clienteId);
    const tipo = types.find(t => t.id == createDto.tipoId);

    if (!cliente || !tipo) {
      return throwError(() => new Error('Cliente ou tipo não encontrado'));
    }

    const newSocialNetwork: SocialNetworkResponseDto = {
      id: 0,
      nome: createDto.nome,
      url: createDto.url,
      tipo: tipo,
      cliente: cliente,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const saved = this.storage.add(this.ENTITY, newSocialNetwork);
    return of(saved as SocialNetworkResponseDto).pipe(delay(300));
  }

  findAll(pagination: any = {}): Observable<PaginatedResponseDto<SocialNetworkResponseDto>> {
    const socialNetworks = this.storage.get<SocialNetworkResponseDto>(this.ENTITY);

    let filtered = socialNetworks;
    if (pagination.search) {
      const search = pagination.search.toLowerCase();
      filtered = socialNetworks.filter(sn =>
        sn.nome.toLowerCase().includes(search) ||
        sn.url.toLowerCase().includes(search) ||
        sn.cliente.nomeRazaoSocial.toLowerCase().includes(search)
      );
    }

    const page = pagination.page || 1;
    const limit = pagination.limit || 10;
    const start = (page - 1) * limit;
    const end = start + limit;
    const data = filtered.slice(start, end);

    const response: PaginatedResponseDto<SocialNetworkResponseDto> = {
      data,
      meta: {
        totalItems: filtered.length,
        itemCount: data.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(filtered.length / limit),
        currentPage: page
      }
    };

    return of(response).pipe(delay(300));
  }

  findOne(id: number): Observable<SocialNetworkResponseDto> {
    const socialNetwork = this.storage.findById<SocialNetworkResponseDto>(this.ENTITY, id);
    if (!socialNetwork) {
      return throwError(() => new Error('Rede social não encontrada'));
    }
    return of(socialNetwork).pipe(delay(300));
  }

  update(id: number, updateDto: UpdateSocialNetworkDto): Observable<SocialNetworkResponseDto> {
    const socialNetwork = this.storage.findById<SocialNetworkResponseDto>(this.ENTITY, id);
    if (!socialNetwork) {
      return throwError(() => new Error('Rede social não encontrada'));
    }

    // Se está atualizando o tipo, busca o novo tipo
    let tipo = socialNetwork.tipo;
    if (updateDto.tipoId) {
      const types = this.storage.get<SocialNetworksTypeResponseDto>('social_network_types');
      tipo = types.find(t => t.id == updateDto.tipoId) || socialNetwork.tipo;
    }

    const updated = {
      ...socialNetwork,
      nome: updateDto.nome || socialNetwork.nome,
      url: updateDto.url || socialNetwork.url,
      tipo: tipo,
      updatedAt: new Date()
    };

    this.storage.update(this.ENTITY, id, updated);
    return of(updated as SocialNetworkResponseDto).pipe(delay(300));
  }

  remove(id: number): Observable<{ message: string }> {
    const success = this.storage.delete(this.ENTITY, id);
    if (!success) {
      return throwError(() => new Error('Rede social não encontrada'));
    }
    return of({ message: 'Rede social removida com sucesso' }).pipe(delay(300));
  }
}
