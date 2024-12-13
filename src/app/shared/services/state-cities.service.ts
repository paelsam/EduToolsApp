import { Injectable } from '@angular/core';
import { DepartamentoConMunicipios } from '../interfaces/statesCities.interface';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StateCitiesService {
  constructor(private http: HttpClient) {}

  public states: Set<string> = new Set<string>();

  getStates(): Observable<string[]> {
    return this.http
      .get<DepartamentoConMunicipios[]>('../../../assets/data/statesCities.json')
      .pipe(
        map((data: DepartamentoConMunicipios[]) => {
          data.forEach((state) => {
            this.states.add(state.departamento);
          });
          return Array.from(this.states);
        })
      );
  }

  getCitiesByState(state: string): Observable<string[]> {
    let cities: string[] = [];
    return this.http
      .get<DepartamentoConMunicipios[]>('../../../assets/data/statesCities.json')
      .pipe(
        map((data: DepartamentoConMunicipios[]) => {
          data.forEach((stateData) => {
            if (stateData.departamento === state) {
              cities.push(stateData.municipio);
            }
          });
          return cities;
        })
      );
  }

  getCities(): Observable<string[]> {
    let cities: string[] = [];
    return this.http
      .get<DepartamentoConMunicipios[]>('../../../assets/data/statesCities.json')
      .pipe(
        map((data: DepartamentoConMunicipios[]) => {
          data.forEach((stateData) => {
            cities.push(stateData.municipio);
          });
          return cities;
        })
      );
  }

}
