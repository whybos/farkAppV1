import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { sliderModel } from '../model/slider.model';
import { ListResponse } from '../model/globalResponseModel';

@Injectable({
  providedIn: 'root',
})
export class SliderService {
  apiUrl: string = 'https://api.ytufarkk.com/api/Slider';
  constructor(private httpClient: HttpClient) {}

  getSlider(): Observable<ListResponse<sliderModel>> {
    return this.httpClient.get<ListResponse<sliderModel>>(this.apiUrl);
  }
  createSlider(data: sliderModel): Observable<ListResponse<sliderModel>> {
    return this.httpClient.post<ListResponse<sliderModel>>(this.apiUrl, data);
  }

  updateSlider(data: sliderModel): Observable<ListResponse<sliderModel>> {
    return this.httpClient.patch<ListResponse<sliderModel>>(
      `https://api.ytufarkk.com/api/Slider`,
      data
    );
  }

  deleteSlider(id: number): Observable<ListResponse<sliderModel>> {
    return this.httpClient.delete<ListResponse<sliderModel>>(
      `${this.apiUrl}?id=${id}`
    );
  }
}
