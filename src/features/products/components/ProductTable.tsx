import { 
    Paper, Table, TableBody, TableCell, TableContainer, 
    TableHead, TableRow, IconButton, Avatar 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import type { ProductTemplate } from '../types';

interface Props {
    products: ProductTemplate[];
    onDelete: (id: number) => void;
    onEdit: (item: ProductTemplate) => void;
}

export const ProductTable = ({ products, onDelete, onEdit }: Props) => {
    return (
        <TableContainer component={Paper} elevation={2}>
            <Table>
                <TableHead sx={{ backgroundColor: '#1976d2' }}>
                    <TableRow>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Ảnh</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Tên mẫu</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Kích thước chuẩn</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Vật tư gốc</TableCell>
                        <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Thao tác</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {products.length === 0 ? (
                        <TableRow><TableCell colSpan={6} align="center">Chưa có dữ liệu</TableCell></TableRow>
                    ) : (
                        products.map((item) => (
                            <TableRow key={item.id} hover>
                                <TableCell>{item.id}</TableCell>
                                
                                {/* HIỂN THỊ ẢNH THUMBNAIL */}
                                <TableCell>
                                    <Avatar 
                                        variant="rounded" 
                                        src={item.imageUrl} 
                                        alt={item.name}
                                        sx={{ width: 60, height: 60, bgcolor: '#e0e0e0' }}
                                    >
                                        {/* Fallback: Nếu không có ảnh thì hiện chữ cái đầu */}
                                        {item.name ? item.name.charAt(0).toUpperCase() : '?'}
                                    </Avatar>
                                </TableCell>

                                <TableCell>
                                    <b>{item.name}</b><br/>
                                    <small style={{color: 'gray'}}>{item.pricingFormula}</small>
                                </TableCell>
                                <TableCell>
                                    {item.defaultWidth} x {item.defaultHeight} x {item.defaultDepth}
                                </TableCell>
                                <TableCell>
                                    {/* Hiển thị tên vật tư lấy từ object quan hệ */}
                                    {item.defaultMaterial?.name || "N/A"}
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton color="primary" onClick={() => onEdit(item)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton color="error" onClick={() => onDelete(item.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};