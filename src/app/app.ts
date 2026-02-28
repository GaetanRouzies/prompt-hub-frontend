import { Component } from '@angular/core'
import { PromptList } from './prompts/prompt-list/prompt-list'
import { Navbar } from './navbar/navbar'

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [PromptList, Navbar],
})
export class App {}
