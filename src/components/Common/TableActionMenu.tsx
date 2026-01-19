import { useState } from 'react';
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PrintIcon from '@mui/icons-material/Print';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';

interface Props {
    onEdit?: () => void;   
    onDelete?: () => void;
    onView?: () => void;
    onPrint?: () => void;
}

export const TableActionMenu = ({ onEdit, onDelete, onView, onPrint }: Props) => {
    const { t } = useTranslation();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <IconButton
                aria-label="more"
                aria-controls={open ? 'action-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                <MoreVertIcon />
            </IconButton>
            
            <Menu
                id="action-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                    elevation: 3,
                    sx: { minWidth: 150 } 
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                {onEdit && (
                    <MenuItem onClick={() => { onEdit(); handleClose(); }}>
                        <ListItemIcon>
                            <EditIcon fontSize="small" color="primary" />
                        </ListItemIcon>
                        <ListItemText>{t('common:edit')}</ListItemText>
                    </MenuItem>
                )}
                
                {onDelete && (
                    <MenuItem onClick={() => { onDelete(); handleClose(); }}>
                        <ListItemIcon>
                            <DeleteIcon fontSize="small" color="error" />
                        </ListItemIcon>
                        <ListItemText sx={{ color: 'error.main' }}>{t('common:delete')}</ListItemText>
                    </MenuItem>
                )}

                {onView && (
                    <MenuItem onClick={() => { onView(); handleClose(); }}>
                        <ListItemIcon>
                            <VisibilityIcon fontSize="small" color="primary" />
                        </ListItemIcon>
                        <ListItemText>{t('common:view')}</ListItemText>
                    </MenuItem>
                )}

                {onPrint && (
                    <MenuItem onClick={() => { onPrint(); handleClose(); }}>
                        <ListItemIcon>
                            <PrintIcon fontSize="small" color="secondary" />
                        </ListItemIcon>
                        <ListItemText>{t('common:print')}</ListItemText>
                    </MenuItem>
                )}
            </Menu>
        </>
    );
};