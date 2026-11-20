import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Job } from '../models/job.model';

export interface JobFilters {
  q?: string;
  location?: string;
  remote?: boolean;
  category?: string;
}

@Injectable({
  providedIn: 'root',
})
export class JobsService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:3000/jobs';

  getJobs(filters: JobFilters = {}): Observable<Job[]> {
    let params = new HttpParams();

    if (filters.q?.trim()) {
      params = params.set('q', filters.q.trim());
    }

    if (filters.location?.trim()) {
      params = params.set(
        'location',
        filters.location.trim(),
      );
    }

    if (filters.remote !== undefined) {
      params = params.set(
        'remote',
        String(filters.remote),
      );
    }

    if (filters.category?.trim()) {
      params = params.set(
        'category',
        filters.category.trim(),
      );
    }

    return this.http.get<Job[]>(
      this.apiUrl,
      { params },
    );
  }
}