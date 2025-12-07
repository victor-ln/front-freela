import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MockStorageService {
  private getStorageKey(entity: string): string {
    return `mock_${entity}`;
  }

  get<T>(entity: string): T[] {
    const data = localStorage.getItem(this.getStorageKey(entity));
    return data ? JSON.parse(data) : [];
  }

  set<T>(entity: string, data: T[]): void {
    localStorage.setItem(this.getStorageKey(entity), JSON.stringify(data));
  }

  add<T extends { id?: number | string }>(entity: string, item: T): T {
    const items = this.get<T>(entity);
    const newId = this.getNextId(items);
    const newItem = { ...item, id: newId };
    items.push(newItem);
    this.set(entity, items);
    return newItem;
  }

  update<T extends { id?: number | string }>(entity: string, id: number | string, item: Partial<T>): T | null {
    const items = this.get<T>(entity);
    const index = items.findIndex((i: any) => i.id == id);
    if (index !== -1) {
      items[index] = { ...items[index], ...item };
      this.set(entity, items);
      return items[index];
    }
    return null;
  }

  delete(entity: string, id: number | string): boolean {
    const items = this.get(entity);
    const filtered = items.filter((i: any) => i.id != id);
    if (filtered.length < items.length) {
      this.set(entity, filtered);
      return true;
    }
    return false;
  }

  findById<T>(entity: string, id: number | string): T | null {
    const items = this.get<T>(entity);
    return items.find((i: any) => i.id == id) || null;
  }

  private getNextId<T extends { id?: number | string }>(items: T[]): number {
    if (items.length === 0) return 1;
    const numericIds = items
      .map((i: any) => typeof i.id === 'string' ? parseInt(i.id) : i.id)
      .filter(id => !isNaN(id as number));
    return numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1;
  }

  initializeIfEmpty(entity: string, defaultData: any[]): void {
    const existing = this.get(entity);
    if (existing.length === 0) {
      this.set(entity, defaultData);
    }
  }
}
