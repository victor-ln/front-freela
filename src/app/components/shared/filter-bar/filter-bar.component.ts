import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface SelectFilter {
  label: string;
  model: string;
  options: { value: string; label: string }[];
  defaultValue?: string;
}

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.css']
})
export class FilterBarComponent<T extends object> implements OnInit {
  @Input() data: T[] = [];
  @Input() searchPlaceholder = 'Buscar...';
  @Input() searchFields: (keyof T)[] = [];
  @Input() selectFilters: SelectFilter[] = [];

  @Output() filteredData = new EventEmitter<T[]>();

  searchTerm = '';
  filterValues: { [key: string]: string } = {};

  ngOnInit(): void {
    // Initialize filter values with defaults
    this.selectFilters.forEach(filter => {
      this.filterValues[filter.model] = filter.defaultValue || '';
    });
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  private applyFilters(): void {
    let filtered = [...this.data];

    // Text search filter
    if (this.searchTerm && this.searchFields.length > 0) {
      const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        this.searchFields.some(field => {
          const value = item[field];
          return typeof value === 'string' && value.toLowerCase().includes(lowerCaseSearchTerm);
        })
      );
    }

    // Select filters
    this.selectFilters.forEach(filter => {
      const selectedValue = this.filterValues[filter.model];
      if (selectedValue) {
        filtered = filtered.filter(item => {
          const itemValue = (item as any)[filter.model];
          return itemValue === selectedValue;
        });
      }
    });

    this.filteredData.emit(filtered);
  }
}