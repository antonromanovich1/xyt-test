import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  private apiService = inject(ApiService)
  ngOnInit(): void {
    this.apiService.getData().subscribe(data => {
      console.log(data);
    })
  }
  title = 'xyt-test';
}
