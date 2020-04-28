import { TestBed } from '@angular/core/testing';
import {LoadingProgressBarService} from './loading-progress-bar.service';
import {LoadingProgressBarModel} from '../models';

describe('LoadingProgressBarService', () => {
  let service: LoadingProgressBarService;
  const loadingProgress: LoadingProgressBarModel = {
    interval: 5,
    intervalValue: 20,
    progressive: false,
    animated: false,
    title: 'test'
  };

  beforeEach(() => {
    jest.useFakeTimers();
    TestBed.configureTestingModule( {
      providers: [
        LoadingProgressBarService
      ]
    });
    service = TestBed.get(LoadingProgressBarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should progress a single progress bar', () => {
    const error = jest.fn();
    const next = jest.fn()

    service.progressBar().subscribe( {
      next: next,
      error: error
    });

    service.start(loadingProgress);

    jest.runAllTimers();

    expect(next).toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(loadingProgress.interval - 1);
    expect(error).not.toHaveBeenCalled();

    service.stop(true);
  });

  it('should progress a second consecutive progress bar', () => {
    const error = jest.fn();
    const next = jest.fn()

    const error_2 = jest.fn();
    const next_2 = jest.fn();

    service.progressBar().subscribe( {
      next: next,
      error: error
    });

    service.start(loadingProgress);

    jest.runAllTimers();

    expect(next).toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(loadingProgress.interval - 1);
    expect(error).not.toHaveBeenCalled();

    service.stop(true);

    service.progressBar().subscribe( {
      next: next_2,
      error: error_2
    });

    loadingProgress.interval = 10;
    loadingProgress.intervalValue = 10;

    service.start(loadingProgress);

    jest.runAllTimers();

    expect(next_2).toHaveBeenCalled();
    expect(next_2).toHaveBeenCalledTimes(loadingProgress.interval - 1);
    expect(error_2).not.toHaveBeenCalled();

    service.stop(true);
  });

  it('should progress two progress bar', () => {
    const error = jest.fn();
    const next = jest.fn()

    const error_2 = jest.fn();
    const next_2 = jest.fn();

    service.progressBar().subscribe( {
      next: next,
      error: error
    });

    service.start(loadingProgress);

    jest.runAllTimers();

    expect(next).toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(loadingProgress.interval - 1);
    expect(error).not.toHaveBeenCalled();

    service.progressBar().subscribe( {
      next: next_2,
      error: error_2
    });

    loadingProgress.interval = 10;
    loadingProgress.intervalValue = 10;

    service.start(loadingProgress);

    jest.runAllTimers();

    expect(next_2).toHaveBeenCalled();
    expect(next_2).toHaveBeenCalledTimes(loadingProgress.interval - 1);
    expect(error_2).not.toHaveBeenCalled();
  });


});
