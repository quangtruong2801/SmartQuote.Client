import { 
  Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, IconButton, Tooltip 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import type { Material } from '../types';
import { formatCurrency } from '../../../utils/formatters';

interface Props {
  materials: Material[];
  onEdit: (item: Material) => void;   // Callback khi bấm sửa
  onDelete: (id: number) => void;     // Callback khi bấm xóa
}

export const MaterialTable = ({ materials, onEdit, onDelete }: Props) => {
  return (
      <TableContainer component={Paper} elevation={2}>
          <Table>
              <TableHead sx={{ backgroundColor: '#1976d2' }}>
                  <TableRow>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Tên vật tư</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Đơn vị</TableCell>
                      <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>Đơn giá</TableCell>
                      <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Thao tác</TableCell>
                  </TableRow>
              </TableHead>
              <TableBody>
                  {materials.length === 0 ? (
                      <TableRow><TableCell colSpan={5} align="center">Chưa có dữ liệu</TableCell></TableRow>
                  ) : (
                      materials.map((item) => (
                          <TableRow key={item.id} hover>
                              <TableCell>{item.id}</TableCell>
                              <TableCell>{item.name}</TableCell>
                              <TableCell>{item.unit}</TableCell>
                              <TableCell align="right">{formatCurrency(item.unitPrice)}</TableCell>
                              <TableCell align="center">
                                  <Tooltip title="Sửa">
                                      <IconButton color="primary" onClick={() => onEdit(item)}>
                                          <EditIcon />
                                      </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Xóa">
                                      <IconButton color="error" onClick={() => onDelete(item.id)}>
                                          <DeleteIcon />
                                      </IconButton>
                                  </Tooltip>
                              </TableCell>
                          </TableRow>
                      ))
                  )}
              </TableBody>
          </Table>
      </TableContainer>
  );
};