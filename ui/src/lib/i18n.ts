import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Importando os JSONs estaticamente (para aplicativos desktop/web rápidos)
import ptBR from '../locales/pt-BR/translation.json';
import enUS from '../locales/en-US/translation.json';

i18n
  .use(initReactI18next) // Passa a instância para o react-i18next
  .init({
    resources: {
      'pt-BR': { translation: ptBR },
      'en-US': { translation: enUS }
    },
    lng: 'pt-BR', // Idioma padrão inicial
    fallbackLng: 'en-US', // Idioma de segurança caso falte alguma chave em português
    interpolation: {
      escapeValue: false // O React já previne XSS por padrão
    }
  });

export default i18n;