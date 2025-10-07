import { Component, inject } from '@angular/core';
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
export class LanguageSwitcher {
  protected currentLang: string = 'en';

  /** List of available language codes */
  protected languages: string[] = ['en', 'es'];
  /** Translation service instance */
  private translate: TranslateService;

  /**
   * Creates an instance of LanguageSwitcher.
   * Initializes the current language from the translation service.
   */
  constructor() {
    this.translate = inject(TranslateService);
    this.currentLang = this.translate.getCurrentLang();
  }

  /**
   * Changes the application's current language.
   * Updates both the translation service and the component's local state.
   *
   * @param language - The language code to switch to (e.g., 'en', 'es')
   */
  useLanguage(language: string) {
    console.log('Language switcher clicked! Changing to:', language);
    console.log('Current language before change:', this.currentLang);
    this.translate.use(language);
    this.currentLang = language;
    console.log('Current language after change:', this.currentLang);
    console.log('TranslateService current lang:', this.translate.currentLang);
  }
}