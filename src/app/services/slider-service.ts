import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { sliderModel } from '../model/slider.model';
import { ListResponse } from '../model/globalResponseModel';

@Injectable({
  providedIn: 'root',
})
export class SliderService {
  apiUrl: string = 'https://localhost:44345/api/Slider';
  constructor(private httpClient: HttpClient) {}

  getSlider(): Observable<ListResponse<sliderModel>> {
    return this.httpClient.get<ListResponse<sliderModel>>(this.apiUrl);
  }
}
