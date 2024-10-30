// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// 如果需要自动检测用户语言，可以引入 LanguageDetector
import LanguageDetector from 'i18next-browser-languagedetector';

// 导入您的翻译资源
import translationEN from './locales/en/translation.json';
import translationZH from './locales/zh/translation.json';

const resources = {
  en: {
    translation: translationEN,
  },
  zh: {
    translation: translationZH,
  },
};

i18n
  // 使用语言检测器
  .use(LanguageDetector)
  // 将 i18n 实例传递给 react-i18next
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en', // 设置默认语言
    debug: true, // 开启调试模式，发布时可关闭

    interpolation: {
      escapeValue: false, // react 已经默认安全，关闭转义
    },
  });

export default i18n;
