import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';

import { Job } from '../../models/job.model';
import { JobsService } from '../../services/jobs.service';

import { IonContent } from '@ionic/angular';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [
    CommonModule,
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

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs(): void {
    this.loading = true;
    this.errorMessage = '';

    this.jobsService.getJobs().subscribe({
      next: (jobs) => {
        this.jobs = jobs;
        this.loading = false;
      },
      error: () => {
        this.errorMessage =
          'No fue posible cargar las ofertas laborales.';
        this.loading = false;
      },
    });
  }
}