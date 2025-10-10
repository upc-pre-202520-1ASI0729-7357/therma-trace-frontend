import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private translate = inject(TranslateService);

  ngOnInit(): void {
    this.translate.addLangs(['en', 'es']);

    this.translate.setDefaultLang('en');

    const savedLang = localStorage.getItem('selectedLanguage');
    let initialLang = 'en'; // Default to English as primary language

    if (savedLang && ['en', 'es'].includes(savedLang)) {
      initialLang = savedLang;
    } else if (this.translate.getBrowserLang()?.match(/es/)) {
      initialLang = 'es';
    }

    this.translate.use(initialLang);
    localStorage.setItem('selectedLanguage', initialLang);

    console.log('Primary language set to English. Current language:', initialLang);
  }
}
