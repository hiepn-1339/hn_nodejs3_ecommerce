import {t} from 'i18next';

export const getTranslatedMessage = (originalMessage, locale) => {
  const lng = locale || 'vi';
  const translatedMessage = t(originalMessage, { lng });
  return translatedMessage;
};
