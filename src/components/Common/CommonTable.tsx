import type { ReactNode } from 'react';
import {
    TableContainer, Table, TableHead, TableRow, TableCell, TableBody,
    Paper, Typography, Checkbox, TablePagination, TableSortLabel,
    Toolbar, IconButton, Tooltip, alpha
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import DeleteIcon from '@mui/icons-material/Delete';

export type ColumnDef<T> = {
    id: string; // keyof T
    label: string | ReactNode;
    minWidth?: number;
    align?: 'left' | 'right' | 'center';
    disablePadding?: boolean;
    sortable?: boolean;
    render?: (item: T) => ReactNode;
}

type Props<T> = {
    columns: ColumnDef<T>[];
    data: T[];
    emptyMessage?: string;
    keyExtractor?: (item: T) => number | string;
    title?: string;
    selectionMode?: 'single' | 'multiple' | 'none';
    selectedIds?: (number | string)[];
    onSelectionChange?: (ids: (number | string)[]) => void;

    // Phần Paginationn
    totalCount?: number;
    page?: number;
    rowsPerPage?: number;
    onPageChange?: (newPage: number) => void;
    onRowsPerPageChange?: (newRowsPerPage: number) => void;

    // Phần Sorting
    orderBy?: string;
    order?: 'asc' | 'desc';
    onSort?: (property: string) => void;
}

export const CommonTable = <T extends { id?: number | string }>({
    columns,
    data,
    emptyMessage = "Không có dữ liệu",
    keyExtractor = (item) => item.id || Math.random(),

    // Default props
    title,
    selectionMode = 'none',
    selectedIds = [],
    onSelectionChange,

    totalCount = 0,
    page = 0,
    rowsPerPage = 5,
    onPageChange,
    onRowsPerPageChange,

    orderBy,
    order,
    onSort
}: Props<T>) => {

    // --- LOGIC XỬ LÝ CHECKBOX ---
    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = data.map((n) => keyExtractor(n));
            onSelectionChange?.(newSelected);
            return;
        }
        onSelectionChange?.([]);
    };

    const handleClick = (id: number | string) => {
        if (selectionMode === 'none') return;

        const selectedIndex = selectedIds.indexOf(id);
        let newSelected: (number | string)[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selectedIds, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selectedIds.slice(1));
        } else if (selectedIndex === selectedIds.length - 1) {
            newSelected = newSelected.concat(selectedIds.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selectedIds.slice(0, selectedIndex),
                selectedIds.slice(selectedIndex + 1),
            );
        }
        onSelectionChange?.(newSelected);
    };

    const isSelected = (id: number | string) => selectedIds.indexOf(id) !== -1;

    // --- LOGIC XỬ LÝ SORT ---
    const createSortHandler = (property: string) => () => {
        onSort?.(property);
    };

    return (
        <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden', width: '100%', mb: 2 }}>

            {/* --- 1. TOOLBAR (Title & Filter) --- */}
            <Toolbar
                sx={{
                    pl: { sm: 2 },
                    pr: { xs: 1, sm: 1 },
                    ...(selectedIds.length > 0 && {
                        bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                    }),
                }}
            >
                {selectedIds.length > 0 ? (
                    <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1" component="div">
                        {selectedIds.length} đã chọn
                    </Typography>
                ) : (
                    <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div" fontWeight="bold">
                        {title}
                    </Typography>
                )}

                {selectedIds.length > 0 ? (
                    <Tooltip title="Xóa">
                        <IconButton>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                ) : (
                    <Tooltip title="Lọc danh sách">
                        <IconButton>
                            <FilterListIcon />
                        </IconButton>
                    </Tooltip>
                )}
            </Toolbar>

            {/* --- 2. TABLE --- */}
            <TableContainer>
                <Table stickyHeader size="medium">
                    <TableHead>
                        <TableRow>
                            {/* Checkbox Header */}
                            {selectionMode === 'multiple' && (
                                <TableCell padding="checkbox" sx={{ bgcolor: '#1976d2' }}>
                                    <Checkbox
                                        color="default"
                                        indeterminate={selectedIds.length > 0 && selectedIds.length < data.length}
                                        checked={data.length > 0 && selectedIds.length === data.length}
                                        onChange={handleSelectAllClick}
                                        sx={{ color: 'white', '&.Mui-checked': { color: 'white' }, '&.MuiCheckbox-indeterminate': { color: 'white' } }}
                                    />
                                </TableCell>
                            )}

                            {columns.map((col) => (
                                <TableCell
                                    key={col.id}
                                    align={col.align || 'left'}
                                    padding={col.disablePadding ? 'none' : 'normal'}
                                    style={{ minWidth: col.minWidth }}
                                    sortDirection={orderBy === col.id ? order : false}
                                    sx={{
                                        backgroundColor: '#1976d2',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {col.sortable ? (
                                        <TableSortLabel
                                            active={orderBy === col.id}
                                            direction={orderBy === col.id ? order : 'asc'}
                                            onClick={createSortHandler(col.id)}
                                            sx={{
                                                '&.MuiTableSortLabel-root': { color: 'white !important' },
                                                '&.MuiTableSortLabel-root:hover': { color: '#e0e0e0 !important' },
                                                '& .MuiTableSortLabel-icon': { color: 'white !important' }
                                            }}
                                        >
                                            {col.label}
                                        </TableSortLabel>
                                    ) : (
                                        col.label
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length + (selectionMode !== 'none' ? 1 : 0)} align="center" sx={{ py: 4 }}>
                                    <Typography color="text.secondary">{emptyMessage}</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((item) => {
                                const id = keyExtractor(item);
                                const isItemSelected = isSelected(id);

                                return (
                                    <TableRow
                                        hover
                                        onClick={() => handleClick(id)}
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={id}
                                        selected={isItemSelected}
                                        sx={{ cursor: selectionMode !== 'none' ? 'pointer' : 'default' }}
                                    >
                                        {/* Checkbox Row */}
                                        {selectionMode === 'multiple' && (
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    color="primary"
                                                    checked={isItemSelected}
                                                />
                                            </TableCell>
                                        )}

                                        {columns.map((col) => {
                                            const cellValue = col.render
                                                ? col.render(item)
                                                // @ts-expect-error - Truy cập dynamic key
                                                : item[col.id];

                                            return (
                                                <TableCell key={col.id} align={col.align || 'left'}>
                                                    {cellValue}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* --- 3. PAGINATION (Phân trang) --- */}
            {totalCount > 0 && onPageChange && (
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={totalCount}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(_, newPage) => onPageChange(newPage)}
                    onRowsPerPageChange={(event) => {
                        if (onRowsPerPageChange) {
                            onRowsPerPageChange(parseInt(event.target.value, 10));
                        }
                    }}
                    labelRowsPerPage="Số dòng mỗi trang:"
                    // Tùy chỉnh text hiển thị "1-5 of 13"
                    labelDisplayedRows={({ from, to, count }) =>
                        `${from}–${to} của ${count !== -1 ? count : `hơn ${to}`}`
                    }
                />
            )}
        </Paper>
    );
};