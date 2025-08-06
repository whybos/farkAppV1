import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/global/navbar/navbar';
import { Footer } from './components/global/footer/footer';

@Component({
  selector: 'app-root',
  imports: [Navbar, Footer, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('firstTry');
}

