import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  inject,
} from '@angular/core';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';

import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { IonContent } from '@ionic/angular';

import { Job } from '../../models/job.model';
import {
  JobFilters,
  JobsService,
} from '../../services/jobs.service';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonContent,
  ],
  templateUrl: './jobs.html',
  styleUrl: './jobs.css',
})
export class JobsPage implements OnInit {
  private readonly jobsService = inject(JobsService);

  jobs: Job[] = [];
  loading = true;
  errorMessage = '';

  readonly filterForm = new FormGroup({
    q: new FormControl('', {
      nonNullable: true,
    }),
    location: new FormControl('', {
      nonNullable: true,
    }),
    remote: new FormControl('', {
      nonNullable: true,
    }),
    category: new FormControl('', {
      nonNullable: true,
    }),
  });

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs(filters: JobFilters = {}): void {
    this.loading = true;
    this.errorMessage = '';

    this.jobsService.getJobs(filters).subscribe({
      next: (jobs) => {
        const token = localStorage.getItem('accessToken');

        if (!token) {
          this.jobs = jobs;
          this.loading = false;
          return;
        }

        const requests = jobs.map((job) =>
          this.jobsService
            .getCompatibility(job.id)
            .pipe(
              catchError(() =>
                of({
                  jobId: job.id,
                  title: job.title,
                  compatibility: 0,
                  matchedSkills: [],
                  missingSkills: [],
                  explanation:
                    'No fue posible calcular compatibilidad.',
                }),
              ),
            ),
        );

        forkJoin(requests).subscribe({
          next: (compatibilities) => {
            this.jobs = jobs
              .map((job) => {
                const compatibility =
                  compatibilities.find(
                    (item) => item.jobId === job.id,
                  );

                return {
                  ...job,
                  compatibility: compatibility
                    ? {
                        compatibility:
                          compatibility.compatibility,
                        matchedSkills:
                          compatibility.matchedSkills,
                        missingSkills:
                          compatibility.missingSkills,
                        explanation:
                          compatibility.explanation,
                      }
                    : undefined,
                };
              })
              .sort(
                (a, b) =>
                  (b.compatibility?.compatibility ?? 0) -
                  (a.compatibility?.compatibility ?? 0),
              );

            this.loading = false;
          },
          error: () => {
            this.jobs = jobs;
            this.loading = false;
          },
        });
      },
      error: () => {
        this.errorMessage =
          'No fue posible cargar las ofertas laborales.';
        this.loading = false;
      },
    });
  }

  applyFilters(): void {
    const values = this.filterForm.getRawValue();

    const filters: JobFilters = {
      q: values.q,
      location: values.location,
      category: values.category,
    };

    if (values.remote === 'true') {
      filters.remote = true;
    }

    if (values.remote === 'false') {
      filters.remote = false;
    }

    this.loadJobs(filters);
  }

  clearFilters(): void {
    this.filterForm.reset({
      q: '',
      location: '',
      remote: '',
      category: '',
    });

    this.loadJobs();
  }
}