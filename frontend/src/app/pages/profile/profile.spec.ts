import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { Profile } from './profile';

describe('Profile', () => {
  let component: Profile;
  let fixture: ComponentFixture<Profile>;

  const httpClientMock = {
    get: jasmine.createSpy('get').and.returnValue(
      of({
        id: 1,
        name: 'Usuario Test',
        email: 'test@example.com',
        location: 'Viña del Mar',
        skills: [],
        interests: [],
        experienceYears: 0,
        preferredRemote: false,
      }),
    ),
  };

  beforeEach(async () => {
    localStorage.setItem('accessToken', 'test-token');

    await TestBed.configureTestingModule({
      imports: [Profile],

      providers: [
        provideRouter([]),

        {
          provide: HttpClient,
          useValue: httpClientMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Profile);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});