import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MockStorageService } from './mock-storage.service';
import { ClientResponseDto, CreateClientDto, UpdateClientDto } from '../../dto/client.dto';
import { PaginatedResponseDto } from '../../../common/dto/pagination.dto';

@Injectable({
  providedIn: 'root'
})
export class MockClientService {
  private readonly ENTITY = 'clients';

  constructor(private storage: MockStorageService) {}

  create(createDto: CreateClientDto): Observable<ClientResponseDto> {
    const newClient: ClientResponseDto = {
      id: 0,
      status: createDto.status,
      nomeRazaoSocial: createDto.nomeRazaoSocial,
      responsavel: createDto.responsavel,
      telefonePrincipal: createDto.telefonePrincipal,
      telefoneSecundario: createDto.telefoneSecundario,
      cpfCnpj: createDto.cpfCnpj,
      email: createDto.email,
      endereco: {
        id: 0,
        cep: createDto.endereco.cep,
        ruaAvenida: createDto.endereco.ruaAvenida,
        numero: createDto.endereco.numero,
        complemento: createDto.endereco.complemento,
        bairro: createDto.endereco.bairro,
        cidade: createDto.endereco.cidade,
        estado: createDto.endereco.estado,
        pais: createDto.endereco.pais,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const saved = this.storage.add(this.ENTITY, newClient);
    return of(saved as ClientResponseDto).pipe(delay(300));
  }

  findAll(pagination: any = {}): Observable<PaginatedResponseDto<ClientResponseDto>> {
    const clients = this.storage.get<ClientResponseDto>(this.ENTITY);

    let filtered = clients;
    if (pagination.search) {
      const search = pagination.search.toLowerCase();
      filtered = clients.filter(c =>
        c.nomeRazaoSocial.toLowerCase().includes(search) ||
        c.email.toLowerCase().includes(search) ||
        c.cpfCnpj.includes(search)
      );
    }

    const page = pagination.page || 1;
    const limit = pagination.limit || 10;
    const start = (page - 1) * limit;
    const end = start + limit;
    const data = filtered.slice(start, end);

    const response: PaginatedResponseDto<ClientResponseDto> = {
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

  findOne(id: number): Observable<ClientResponseDto> {
    const client = this.storage.findById<ClientResponseDto>(this.ENTITY, id);
    if (!client) {
      return throwError(() => new Error('Cliente não encontrado'));
    }
    return of(client).pipe(delay(300));
  }

  update(id: number, updateDto: UpdateClientDto): Observable<ClientResponseDto> {
    const client = this.storage.findById<ClientResponseDto>(this.ENTITY, id);
    if (!client) {
      return throwError(() => new Error('Cliente não encontrado'));
    }

    const updated = {
      ...client,
      ...updateDto,
      endereco: updateDto.endereco ? { ...client.endereco, ...updateDto.endereco } : client.endereco,
      updatedAt: new Date()
    };

    this.storage.update(this.ENTITY, id, updated);
    return of(updated as ClientResponseDto).pipe(delay(300));
  }

  remove(id: number): Observable<{ message: string }> {
    const success = this.storage.delete(this.ENTITY, id);
    if (!success) {
      return throwError(() => new Error('Cliente não encontrado'));
    }
    return of({ message: 'Cliente removido com sucesso' }).pipe(delay(300));
  }
}
