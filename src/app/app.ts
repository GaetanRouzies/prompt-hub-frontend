import { Component } from '@angular/core'
import { PromptList } from './prompts/prompt-list/prompt-list'
import { Navbar } from './navbar/navbar'
import { RouterOutlet } from '@angular/router'
import { Toast } from 'primeng/toast'

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [Navbar, RouterOutlet, Toast],
})
export class App {}
