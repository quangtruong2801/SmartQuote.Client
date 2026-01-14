import { useState } from 'react';
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Tooltip } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import CheckIcon from '@mui/icons-material/Check';
import { useThemeContext } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';

export const ThemeSwitcher = () => {
    const { mode, setMode } = useThemeContext();
    const { t } = useTranslation();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleChange = (newMode: 'light' | 'dark' | 'system') => {
        setMode(newMode);
        handleClose();
    };

    const renderIcon = () => {
        if (mode === 'dark') return <DarkModeIcon />;
        if (mode === 'light') return <LightModeIcon />;
        return <SettingsBrightnessIcon />;
    };

    return (
        <>
            <Tooltip title={t('header:theme')}>
                <IconButton onClick={handleClick} color="inherit">
                    {renderIcon()}
                </IconButton>
            </Tooltip>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
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
                <MenuItem onClick={() => handleChange('light')}>
                    <ListItemIcon><LightModeIcon fontSize="small" /></ListItemIcon>
                    <ListItemText>{t('header:light')}</ListItemText>
                    {mode === 'light' && <CheckIcon fontSize="small" sx={{ ml: 2 }} />}
                </MenuItem>
                
                <MenuItem onClick={() => handleChange('dark')}>
                    <ListItemIcon><DarkModeIcon fontSize="small" /></ListItemIcon>
                    <ListItemText>{t('header:dark')}</ListItemText>
                    {mode === 'dark' && <CheckIcon fontSize="small" sx={{ ml: 2 }} />}
                </MenuItem>

                <MenuItem onClick={() => handleChange('system')}>
                    <ListItemIcon><SettingsBrightnessIcon fontSize="small" /></ListItemIcon>
                    <ListItemText>{t('header:system')}</ListItemText>
                    {mode === 'system' && <CheckIcon fontSize="small" sx={{ ml: 2 }} />}
                </MenuItem>
            </Menu>
        </>
    );
};