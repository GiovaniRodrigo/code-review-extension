import { en } from './locales/en';
import { ptBr } from './locales/pt-br';

export type Translations = typeof en;

export function getTranslations(language: string): Translations {
  const lang = language.toLowerCase();
  if (lang.startsWith('pt')) {
    return ptBr;
  }
  return en;
}

export function translateStatus(status: string, locale: string): string {
  if (locale === 'pt-br') {
    if (status === 'OPEN') return 'ABERTO';
    if (status === 'IN_REVIEW') return 'EM REVISÃO';
    if (status === 'NEEDS_CHANGES') return 'NECESSITA AJUSTES';
    if (status === 'FIXED') return 'CORRIGIDO';
    if (status === 'APPROVED') return 'APROVADO';
    if (status === 'REOPENED') return 'REABERTO';
  } else {
    if (status === 'OPEN') return 'OPEN';
    if (status === 'IN_REVIEW') return 'IN REVIEW';
    if (status === 'NEEDS_CHANGES') return 'NEEDS CHANGES';
    if (status === 'FIXED') return 'FIXED';
    if (status === 'APPROVED') return 'APPROVED';
    if (status === 'REOPENED') return 'REOPENED';
  }
  return status;
}

export const t = (key: string, locale: 'en' | 'pt-br' = 'en') => {
  const translations = getTranslations(locale);
  return (translations as any)[key] || key;
};
