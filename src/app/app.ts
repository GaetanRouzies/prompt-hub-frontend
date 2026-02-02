import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { Toast } from 'primeng/toast'
import { NavbarComponent } from './navbar/navbar'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toast, NavbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
