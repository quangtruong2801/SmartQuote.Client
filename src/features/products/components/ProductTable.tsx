import { 
  Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, IconButton 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import type { ProductTemplate } from '../types';

interface Props {
  products: ProductTemplate[];
  onDelete: (id: number) => void;
}

export const ProductTable = ({ products, onDelete }: Props) => {
  return (
      <TableContainer component={Paper} elevation={2}>
          <Table>
              <TableHead sx={{ backgroundColor: '#1976d2' }}>
                  <TableRow>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Tên mẫu</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Kích thước chuẩn</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Vật tư gốc</TableCell>
                      <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Thao tác</TableCell>
                  </TableRow>
              </TableHead>
              <TableBody>
                  {products.map((item) => (
                      <TableRow key={item.id} hover>
                          <TableCell>{item.id}</TableCell>
                          <TableCell>
                              <b>{item.name}</b><br/>
                              <small style={{color: 'gray'}}>CT: {item.pricingFormula}</small>
                          </TableCell>
                          <TableCell>
                              {item.defaultWidth} x {item.defaultHeight} x {item.defaultDepth}
                          </TableCell>
                          <TableCell>
                              {/* Hiển thị tên vật tư lấy từ object quan hệ */}
                              {item.defaultMaterial?.name || "N/A"}
                          </TableCell>
                          <TableCell align="center">
                              <IconButton color="error" onClick={() => onDelete(item.id)}>
                                  <DeleteIcon />
                              </IconButton>
                          </TableCell>
                      </TableRow>
                  ))}
              </TableBody>
          </Table>
      </TableContainer>
  );
};