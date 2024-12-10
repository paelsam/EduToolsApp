import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { LoadingService } from '../../../shared/services/loading.service';

@Component({
  selector: 'app-verify-user',
  templateUrl: './verify-user.component.html',
  styleUrl: './verify-user.component.scss'
})
export class VerifyUserComponent implements OnInit {

  private userId: string = '';
  private token: string = '';
  public loading!: boolean;
  public isVerified!: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private loadingService: LoadingService

  ) { }

  ngOnInit(): void {
    this.loadingService.loading$.subscribe((loading) => {
      this.loading = loading;
    });

    this.userId = this.activatedRoute.snapshot.params["userId"];
    this.token = this.activatedRoute.snapshot.params["token"];

    this.verifyUser();
  }

  verifyUser(): void {
      // Cambiar el valor de isVerified a true en caso de que la verificación sea exitosa
      this.authenticationService.activateUser(this.userId, this.token)
        .subscribe({
          next: () => {
            this.loadingService.setLoading(false);
            this.isVerified = true;
          },
          error: () => {
            this.loadingService.setLoading(false);
            this.isVerified = false;
          }
        });
  }

}
