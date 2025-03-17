import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OllamaService } from './services/ollama.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [OllamaService],
})
export class AppComponent implements OnInit {
  title = 'solias';
  private _ollamaService = inject(OllamaService);

  ngOnInit(): void {
    this._ollamaService.welcome().subscribe((res) => console.log(res));
  }
}
