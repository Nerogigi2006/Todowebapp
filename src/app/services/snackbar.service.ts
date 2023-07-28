import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackBar: MatSnackBar) {}

  showSuccess(message: string, action: string = 'Close', duration: number = 3000) {
    this.showSnackbar(message, action, duration, 'success-snackbar');
  }

  showError(message: string, action: string = 'Close', duration: number = 5000) {
    this.showSnackbar(message, action, duration, 'error-snackbar');
  }

  private showSnackbar(message: string, action: string, duration: number, panelClass: string) {
    this.snackBar.open(message, action, {
      duration,
      panelClass,
    });
  }
}
