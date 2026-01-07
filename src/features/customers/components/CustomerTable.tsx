import { 
  Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, IconButton, Tooltip 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit'; // Import icon sửa
import type { Customer } from '../types';
import { useTranslation } from 'react-i18next';
interface Props {
  customers: Customer[];
  onDelete: (id: number) => void;
  onEdit: (customer: Customer) => void; // Thêm prop này
}

export const CustomerTable = ({ customers, onDelete, onEdit }: Props) => {
  const { t } = useTranslation();
  return (
      <TableContainer component={Paper} elevation={2}>
          <Table>
              <TableHead sx={{ backgroundColor: '#1976d2' }}>
                  <TableRow>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>{t('customers:customerName')}</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>{t('customers:customerPhone')}</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>{t('customers:customerEmail')}</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>{t('customers:customerAddress')}</TableCell>
                      <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>{t('customers:actions')}</TableCell>
                  </TableRow>
              </TableHead>
              <TableBody>
                  {customers.length === 0 ? (
                      <TableRow><TableCell colSpan={6} align="center">{t('customers:noCustomers')}</TableCell></TableRow>
                  ) : (
                      customers.map((item) => (
                          <TableRow key={item.id} hover>
                              <TableCell>{item.id}</TableCell>
                              <TableCell><b>{item.name}</b></TableCell>
                              <TableCell>{item.phone}</TableCell>
                              <TableCell>{item.email || '---'}</TableCell>
                              <TableCell>{item.address || '---'}</TableCell>
                              <TableCell align="center">
                                  <Tooltip title={t('customers:editInformation')}>
                                      <IconButton color="primary" onClick={() => onEdit(item)}>
                                          <EditIcon />
                                      </IconButton>
                                  </Tooltip>
                                  <Tooltip title={t('customers:deleteCustomer')}>
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