import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [FormsModule],
})
export class App {
  // Text Interpolation et Binding
  title = 'Bienvenue sur Angular !'
  isChecked = false

  // events
  count = 0
  increment() {
    this.count++
  }

  logKeyDownEvent(event: KeyboardEvent) {
    console.log(event)
  }

  // two-way databinding
  inputValue = 'Initial value'

  // Control Flow
  a = 5
  b = 10

  people = [
    { id: 1, name: 'Gaëtan', age: 30 },
    { id: 2, name: 'Jacques', age: 60 },
    { id: 3, name: 'René', age: 90 },
  ]
}
