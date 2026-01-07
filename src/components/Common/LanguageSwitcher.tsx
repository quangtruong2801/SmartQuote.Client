import { IconButton, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'vi' ? 'en' : 'vi';
    i18n.changeLanguage(newLang);
  };

  const flagSrc =
    i18n.language === 'vi' ? '/flags/vi.svg' : '/flags/en.svg';

  return (
    <IconButton onClick={toggleLanguage} sx={{ ml: 1 }}>
      <Box
        component="img"
        src={flagSrc}
        alt="language"
        sx={{
          width: 28,
          height: 20,
          borderRadius: '4px',
          boxShadow: 1,
        }}
      />
    </IconButton>
  );
};
