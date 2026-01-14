import { useState } from 'react';
import { 
    IconButton, Box, Menu, MenuItem, ListItemIcon, ListItemText, Typography, Tooltip 
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import CheckIcon from '@mui/icons-material/Check';

export const LanguageSwitcher = () => {
    const { i18n, t } = useTranslation();
    
    // State quản lý vị trí mở Menu
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    // Mở menu khi click
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    // Đóng menu
    const handleClose = () => {
        setAnchorEl(null);
    };

    // Xử lý chọn ngôn ngữ
    const handleChangeLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
        handleClose();
    };

    // Hàm lấy đường dẫn ảnh cờ
    const getFlagSrc = (lang: string) => {
        return lang === 'vi' ? '/flags/vi.svg' : '/flags/en.svg';
    };

    return (
        <>
            {/* 1. Nút hiển thị ngôn ngữ hiện tại */}
            <Tooltip title={t('header:changeLanguage')}>
                <IconButton 
                    onClick={handleClick}
                    size="small"
                    sx={{ ml: 1 }}
                    aria-controls={open ? 'language-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                >
                    <Box
                        component="img"
                        src={getFlagSrc(i18n.language)}
                        alt="current-language"
                        sx={{
                            width: 28,
                            height: 20,
                            borderRadius: '4px',
                            boxShadow: 1,
                            objectFit: 'cover',
                            border: '1px solid rgba(0,0,0,0.1)'
                        }}
                    />
                </IconButton>
            </Tooltip>

            {/* 2. Menu xổ xuống (Dropdown) */}
            <Menu
                anchorEl={anchorEl}
                id="language-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                {/* Lựa chọn Tiếng Việt */}
                <MenuItem onClick={() => handleChangeLanguage('vi')}>
                    <ListItemIcon>
                        <Box component="img" src="/flags/vi.svg" sx={{ width: 24, borderRadius: '2px' }} />
                    </ListItemIcon>
                    <ListItemText>{t('header:vietnamese')}</ListItemText>
                    {/* Dấu tick nếu đang chọn */}
                    {i18n.language === 'vi' && (
                        <Typography variant="body2" color="text.secondary">
                            <CheckIcon fontSize="small" />
                        </Typography>
                    )}
                </MenuItem>

                {/* Lựa chọn Tiếng Anh */}
                <MenuItem onClick={() => handleChangeLanguage('en')}>
                    <ListItemIcon>
                        <Box component="img" src="/flags/en.svg" sx={{ width: 24, borderRadius: '2px' }} />
                    </ListItemIcon>
                    <ListItemText>{t('header:english')}</ListItemText>
                    {/* Dấu tick nếu đang chọn */}
                    {i18n.language === 'en' && (
                        <Typography variant="body2" color="text.secondary">
                            <CheckIcon fontSize="small" />
                        </Typography>
                    )}
                </MenuItem>
            </Menu>
        </>
    );
};