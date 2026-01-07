import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Divider,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Alert,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import SendIcon from "@mui/icons-material/Send";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import type { QuotationDetailDto, QuotationStatus } from "../types";
import { formatCurrency } from "../../../utils/formatters";
import { isAdmin } from "../../../utils/auth";
import { useSnackbar } from "notistack";
import { quotationService } from "../services/quotationService";

interface Props {
  open: boolean;
  data: QuotationDetailDto | null;
  onClose: () => void;
  onStatusChange: () => void;
}

// Hàm helper lấy màu trạng thái (tái sử dụng logic cũ)
const getStatusColor = (status: QuotationStatus) => {
  switch (status) {
    case "Draft":
      return "default";
    case "Sent":
      return "info";
    case "Approved":
      return "success";
    case "Rejected":
      return "error";
    default:
      return "default";
  }
};

const getStatusLabel = (status: QuotationStatus) => {
  switch (status) {
    case "Draft":
      return "Bản nháp";
    case "Sent":
      return "Đã gửi khách";
    case "Approved":
      return "Khách đã chốt";
    case "Rejected":
      return "Khách từ chối";
    default:
      return "Unknown";
  }
};

export const QuotationDetailDialog = ({
  open,
  data,
  onClose,
  onStatusChange,
}: Props) => {
  const { enqueueSnackbar } = useSnackbar();
  if (!data) return null;
  const isAdminUser = isAdmin();

  // Tính tổng tiền hàng (SubTotal) từ danh sách items
  const subTotal = data.items.reduce((sum, item) => sum + item.totalPrice, 0);

  // Tính tiền giảm giá
  const discountAmount = subTotal * (data.discountPercent / 100);
  const afterDiscount = subTotal - discountAmount;

  // Tính tiền thuế
  const taxAmount = afterDiscount * (data.taxPercent / 100);
  // Hàm xử lý đổi trạng thái
  const handleChangeStatus = async (newStatus: QuotationStatus) => {
    if (!confirm("Bạn có chắc chắn muốn thay đổi trạng thái?")) return;

    try {
      await quotationService.updateStatus(data.id, newStatus);
      enqueueSnackbar("Cập nhật trạng thái thành công!", {
        variant: "success",
      });
      onStatusChange(); // Reload list
      onClose(); // Đóng dialog
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Lỗi cập nhật trạng thái!", { variant: "error" });
    }
  };
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      {/* Header Dialog */}
      <DialogTitle sx={{ bgcolor: "#f5f5f5", borderBottom: "1px solid #ddd" }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight="bold">
            Chi tiết Báo giá #{data.id}
          </Typography>
          <Chip
            label={getStatusLabel(data.status)}
            color={getStatusColor(data.status)}
            variant="filled"
          />
        </Box>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        {/* Cảnh báo nếu đã duyệt */}
        {data.status === "Approved" && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Báo giá này đã được duyệt và khóa chỉnh sửa.
          </Alert>
        )}
        {/* 1. Thông tin Khách hàng */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            color="primary"
            gutterBottom
          >
            I. THÔNG TIN KHÁCH HÀNG
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6 }}>
              <Typography variant="body2" color="text.secondary">
                Họ tên:
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {data.customerName}
              </Typography>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Typography variant="body2" color="text.secondary">
                Điện thoại:
              </Typography>
              <Typography variant="body1">
                {data.customerPhone || "---"}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Typography variant="body2" color="text.secondary">
                Địa chỉ:
              </Typography>
              <Typography variant="body1">
                {data.customerAddress || "---"}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* 2. Danh sách sản phẩm */}
        <Box>
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            color="primary"
            gutterBottom
          >
            II. CHI TIẾT ĐƠN HÀNG
          </Typography>
          <Table size="small" sx={{ border: "1px solid #eee" }}>
            <TableHead sx={{ bgcolor: "#e3f2fd" }}>
              <TableRow>
                <TableCell>
                  <b>Sản phẩm</b>
                </TableCell>
                <TableCell>
                  <b>Kích thước (mm)</b>
                </TableCell>
                <TableCell align="right">
                  <b>Đơn giá</b>
                </TableCell>
                <TableCell align="center">
                  <b>SL</b>
                </TableCell>
                <TableCell align="right">
                  <b>Thành tiền</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.items?.map((item, index) => (
                <TableRow key={index} hover>
                  <TableCell>
                    <b>{item.productName}</b>
                  </TableCell>
                  <TableCell>
                    {item.width} x {item.height} x {item.depth}
                  </TableCell>
                  <TableCell align="right">
                    {formatCurrency(item.unitPriceSnapshot)}
                  </TableCell>
                  <TableCell align="center">{item.quantity}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>
                    {formatCurrency(item.totalPrice)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>

        {/* 3. Tổng tiền */}
        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
          <Box sx={{ width: "50%", minWidth: 300 }}>
            <Grid container spacing={1}>
              {/* Tạm tính */}
              <Grid size={{ xs: 6 }} textAlign="right">
                <Typography color="text.secondary">Tạm tính:</Typography>
              </Grid>
              <Grid size={{ xs: 6 }} textAlign="right">
                <Typography fontWeight="bold">
                  {formatCurrency(subTotal)}
                </Typography>
              </Grid>

              {/* Chiết khấu (Chỉ hiện nếu > 0) */}
              {data.discountPercent > 0 && (
                <>
                  <Grid size={{ xs: 6 }} textAlign="right">
                    <Typography color="text.secondary">
                      Chiết khấu ({data.discountPercent}%):
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }} textAlign="right">
                    <Typography color="error">
                      - {formatCurrency(discountAmount)}
                    </Typography>
                  </Grid>
                </>
              )}

              {/* Thuế VAT (Chỉ hiện nếu > 0) */}
              {data.taxPercent > 0 && (
                <>
                  <Grid size={{ xs: 6 }} textAlign="right">
                    <Typography color="text.secondary">
                      Thuế VAT ({data.taxPercent}%):
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }} textAlign="right">
                    <Typography color="primary">
                      + {formatCurrency(taxAmount)}
                    </Typography>
                  </Grid>
                </>
              )}

              <Grid size={{ xs: 12 }}>
                <Divider sx={{ my: 1 }} />
              </Grid>

              {/* TỔNG CỘNG */}
              <Grid size={{ xs: 6 }} textAlign="right">
                <Typography variant="h6">TỔNG CỘNG:</Typography>
              </Grid>
              <Grid size={{ xs: 6 }} textAlign="right">
                <Typography variant="h6" color="primary" fontWeight="bold">
                  {formatCurrency(data.totalAmount)}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          Đóng
        </Button>
        {/* --- LOGIC HIỂN THỊ NÚT BẤM --- */}

        {/* 1. Nếu là NHÁP -> Hiện nút GỬI DUYỆT */}
        {data.status === "Draft" && (
          <Button
            variant="contained"
            color="info"
            startIcon={<SendIcon />}
            onClick={() => handleChangeStatus("Sent")}
          >
            Gửi duyệt
          </Button>
        )}

        {/* 2. Nếu đang CHỜ DUYỆT và là ADMIN -> Hiện nút DUYỆT / TỪ CHỐI */}
        {data.status === "Sent" && isAdminUser && (
          <>
            <Button
              variant="outlined"
              color="error"
              startIcon={<CancelIcon />}
              onClick={() => handleChangeStatus("Rejected")}
            >
              Từ chối
            </Button>
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckCircleIcon />}
              onClick={() => handleChangeStatus("Approved")}
            >
              Duyệt đơn
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};
