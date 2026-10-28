import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, forkJoin, map, Observable, of, switchMap } from 'rxjs';
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
    return this.httpClient.patch<ListResponse<sliderModel>>(this.apiUrl, data);
  }

  deleteSlider(id: number): Observable<ListResponse<sliderModel>> {
    return this.httpClient.delete<ListResponse<sliderModel>>(
      `${this.apiUrl}?id=${id}`
    );
  }

  deleteAllSlider(): Observable<number> {
    return this.httpClient.delete(`${this.apiUrl}/deleteAll`).pipe(
      catchError(() => of(null)),
      switchMap(() =>
        this.getSlider().pipe(
          catchError(() => of({ success: false, message: '', data: [] as sliderModel[] }))
        )
      ),
      switchMap((resp) => {
        const items = Array.isArray(resp?.data) ? resp.data : [];
        if (items.length === 0) return of(0);
        return forkJoin(
          items.map((item) =>
            this.deleteSlider(item.id).pipe(catchError(() => of(null)))
          )
        ).pipe(map(() => items.length));
      })
    );
  }
}
