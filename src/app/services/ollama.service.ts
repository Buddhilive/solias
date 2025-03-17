import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable()
export class OllamaService {
  private httpClient = inject(HttpClient);

  welcome() {
    const headers = new HttpHeaders({'Accept':'text/plain'});
    return this.httpClient.get('http://localhost:11434', { headers: headers, responseType: 'text' });
  }

  generate() {
    const body = {
      model: 'qwen2.5-coder:7b',
      prompt: 'hello',
    };
    return this.httpClient.post('http://localhost:11434', body);
  }
}
