import { useState, useMemo } from 'react';

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    const valueA = a[orderBy] ?? '';
    const valueB = b[orderBy] ?? '';

    if (valueB < valueA) {
        return -1;
    }
    if (valueB > valueA) {
        return 1;
    }
    return 0;
}

function getComparator<T>(
    order: 'asc' | 'desc',
    orderBy: keyof T,
): (a: T, b: T) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

// --- INTERFACE ---
interface UseTableProps<T> {
    data: T[];
    defaultOrderBy: keyof T;
    defaultOrder?: 'asc' | 'desc';
    defaultRowsPerPage?: number;
}

// --- MAIN HOOK ---
export const useTable = <T extends { id?: string | number }>({
    data,
    defaultOrderBy,
    defaultOrder = 'asc',
    defaultRowsPerPage = 5
}: UseTableProps<T>) => {
    
    // State
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
    const [order, setOrder] = useState<'asc' | 'desc'>(defaultOrder);
    const [orderBy, setOrderBy] = useState<keyof T>(defaultOrderBy);
    const [selectedIds, setSelectedIds] = useState<(number | string)[]>([]);

    // Handlers
    const handleRequestSort = (property: string) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property as keyof T);
    };

    const handleChangePage = (newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (newRows: number) => {
        setRowsPerPage(newRows);
        setPage(0);
    };

    const handleSelectionChange = (newSelectedIds: (number | string)[]) => {
        setSelectedIds(newSelectedIds);
    };

    // Tính toán dữ liệu hiển thị
    const visibleRows = useMemo(() => {
        return stableSort(data, getComparator<T>(order, orderBy))
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    }, [data, order, orderBy, page, rowsPerPage]);

    return {
        visibleRows,
        selectedIds,
        setSelectedIds,
        commonTableProps: {
            data: visibleRows,
            totalCount: data.length,
            page,
            rowsPerPage,
            order,
            orderBy: orderBy as string,
            selectedIds,
            onPageChange: handleChangePage,
            onRowsPerPageChange: handleChangeRowsPerPage,
            onSort: handleRequestSort,
            onSelectionChange: handleSelectionChange,
        }
    };
};