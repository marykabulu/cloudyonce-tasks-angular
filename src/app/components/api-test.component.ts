import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AITestService } from '../services/ai-test.service';

@Component({
  selector: 'app-api-test',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="test-container">
      <h2>AWS API Endpoint Test</h2>
      <button (click)="testEndpoints()" [disabled]="testing">
        {{ testing ? 'Testing...' : 'Test All Endpoints' }}
      </button>
      
      <div *ngIf="results" class="results">
        <h3>Test Results:</h3>
        <div *ngFor="let result of getResultEntries()" class="endpoint-result">
          <h4>{{ result.key }}</h4>
          <div [class]="result.value.success ? 'success' : 'error'">
            <strong>Status:</strong> {{ result.value.success ? 'SUCCESS' : 'FAILED' }}
            <div *ngIf="!result.value.success">
              <strong>Error:</strong> {{ result.value.error.status }} - {{ result.value.error.message }}
              <pre *ngIf="result.value.error.details">{{ result.value.error.details | json }}</pre>
            </div>
            <div *ngIf="result.value.success">
              <strong>Response:</strong>
              <pre>{{ result.value.data | json }}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .test-container { padding: 20px; }
    .results { margin-top: 20px; }
    .endpoint-result { margin: 15px 0; padding: 10px; border: 1px solid #ddd; }
    .success { color: green; }
    .error { color: red; }
    pre { background: #f5f5f5; padding: 10px; overflow-x: auto; }
    button { padding: 10px 20px; font-size: 16px; }
    button:disabled { opacity: 0.6; }
  `]
})
export class ApiTestComponent {
  testing = false;
  results: any = null;

  constructor(private testService: AITestService) {}

  testEndpoints() {
    this.testing = true;
    this.results = null;
    
    this.testService.testAllEndpoints().subscribe({
      next: (results) => {
        this.results = results;
        this.testing = false;
        console.log('API Test Results:', results);
      },
      error: (error) => {
        console.error('Test failed:', error);
        this.testing = false;
      }
    });
  }

  getResultEntries() {
    return this.results ? Object.entries(this.results) : [];
  }
}