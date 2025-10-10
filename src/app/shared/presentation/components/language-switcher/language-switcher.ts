import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-language-switcher',
  imports: [
    MatButtonToggleGroup,
    MatButtonToggle
  ],
  templateUrl: './language-switcher.html',
  styleUrl: './language-switcher.css'
})
export class LanguageSwitcher implements OnInit {
  protected currentLang = signal<string>('en');

  /** List of available language codes */
  protected languages: string[] = ['en', 'es'];
  /** Translation service instance */
  private translate = inject(TranslateService);

  ngOnInit() {
    // Initialize with current language from TranslateService
    const currentLang = this.translate.currentLang || this.translate.getDefaultLang() || 'en';
    this.currentLang.set(currentLang);
  }

  /**
   * Changes the application's current language.
   * Updates both the translation service and the component's local state.
   *
   * @param language - The language code to switch to (e.g., 'en', 'es')
   */
  useLanguage(language: string) {
    console.log('Language switcher clicked! Changing to:', language);
    this.translate.use(language);
    this.currentLang.set(language);

    // Save to localStorage for persistence
    localStorage.setItem('selectedLanguage', language);

    console.log('Language changed to:', language);
  }
}
