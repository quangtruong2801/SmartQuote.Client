import { createContext, useContext, useState, useMemo, type ReactNode } from 'react';
import { createTheme, ThemeProvider as MUIThemeProvider, CssBaseline, useMediaQuery } from '@mui/material';

type ColorMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
    mode: ColorMode;
    setMode: (mode: ColorMode) => void;
}

const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

// Custom Hook để các component con gọi
// eslint-disable-next-line react-refresh/only-export-components
export const useThemeContext = () => useContext(ThemeContext);

// Provider bao bọc ứng dụng
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    // Lấy setting từ localStorage (nếu không có thì mặc định là 'system')
    const [mode, setModeState] = useState<ColorMode>(() => {
        const saved = localStorage.getItem('theme_mode');
        return (saved as ColorMode) || 'system';
    });

    // Check xem hệ điều hành đang để Dark hay Light
    const systemPrefersDark = useMediaQuery('(prefers-color-scheme: dark)');

    // Hàm lưu mode mới
    const setMode = (newMode: ColorMode) => {
        setModeState(newMode);
        localStorage.setItem('theme_mode', newMode);
    };

    // Tính toán xem thực tế sẽ hiển thị Light hay Dark
    const resolvedMode = useMemo(() => {
        if (mode === 'system') {
            return systemPrefersDark ? 'dark' : 'light';
        }
        return mode;
    }, [mode, systemPrefersDark]);

    // Tạo Theme của MUI
    const theme = useMemo(() => createTheme({
        palette: {
            mode: resolvedMode,
            primary: {
                main: '#1976d2', // Màu xanh chủ đạo
            },
            secondary: {
                main: '#9c27b0',
            },
            // Tùy chỉnh màu nền cho Dark Mode đỡ bị đen sì
            ...(resolvedMode === 'dark' && {
                background: {
                    default: '#121212',
                    paper: '#1e1e1e',
                },
            }),
        },
        // Tùy chỉnh Component
        components: {
            MuiTableCell: {
                styleOverrides: {
                    head: {
                        // Giữ màu xanh cho Header nhưng tối hơn chút ở Dark Mode
                        backgroundColor: resolvedMode === 'dark' ? '#0d47a1' : '#1976d2',
                        color: '#ffffff',
                    }
                }
            }
        }
    }), [resolvedMode]);

    return (
        <ThemeContext.Provider value={{ mode, setMode }}>
            <MUIThemeProvider theme={theme}>
                {/* CssBaseline giúp reset CSS và đổi màu nền body tự động */}
                <CssBaseline />
                {children}
            </MUIThemeProvider>
        </ThemeContext.Provider>
    );
};