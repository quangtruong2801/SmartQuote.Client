import type { ReactNode } from 'react';
import {
    TableContainer, Table, TableHead, TableRow, TableCell, TableBody,
    Paper, Typography
} from '@mui/material';

export interface ColumnDef<T> {
    id: string;
    label: string | ReactNode;
    minWidth?: number;
    align?: 'left' | 'right' | 'center';
    render?: (item: T) => ReactNode; 
}

interface Props<T> {
    columns: ColumnDef<T>[];
    data: T[];
    emptyMessage?: string;
    keyExtractor?: (item: T) => number | string;
}

export const CommonTable = <T extends { id?: number | string }>({ 
    columns, 
    data, 
    emptyMessage = "Không có dữ liệu",
    keyExtractor = (item) => item.id || Math.random()
}: Props<T>) => {
    return (
        <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Table stickyHeader>
                {/* --- HEADER --- */}
                <TableHead>
                    <TableRow>
                        {columns.map((col) => (
                            <TableCell
                                key={col.id}
                                align={col.align || 'left'}
                                style={{ minWidth: col.minWidth }}
                                sx={{ 
                                    backgroundColor: '#1976d2',
                                    color: 'white', 
                                    fontWeight: 'bold',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {col.label}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>

                {/* --- BODY --- */}
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={columns.length} align="center" sx={{ py: 4 }}>
                                <Typography color="text.secondary">{emptyMessage}</Typography>
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((item) => (
                            <TableRow hover key={keyExtractor(item)} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                {columns.map((col) => {
                                    const cellValue = col.render 
                                        ? col.render(item) 
                                        // @ts-expect-error - Truy cập dynamic key an toàn
                                        : item[col.id]; 

                                    return (
                                        <TableCell key={col.id} align={col.align || 'left'}>
                                            {cellValue}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};