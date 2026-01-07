import { useState, useEffect, useRef } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  IconButton,
  Divider,
} from "@mui/material";
import Grid from "@mui/material/Grid";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import GridViewIcon from "@mui/icons-material/GridView";

import { customerService } from "../../customers/services/customerService";
import { materialService } from "../../materials/services/materialService";
import { productService } from "../../products/services/productService";

import type { Customer } from "../../customers/types";
import type { Material } from "../../materials/types";
import type { ProductTemplate } from "../../products/types";
import type { QuotationCreateDto, QuotationItemCreateDto } from "../types";

import { formatCurrency } from "../../../utils/formatters";
import { useTranslation } from 'react-i18next';
interface Props {
  onSubmit: (data: QuotationCreateDto) => void;
  onOpenSelector: () => void;
  selectedProductFromDialog: ProductTemplate | null;
}

export const QuotationBuilder = ({
  onSubmit,
  onOpenSelector,
  selectedProductFromDialog,
}: Props) => {
  const { t } = useTranslation();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [products, setProducts] = useState<ProductTemplate[]>([]);

  const [customerId, setCustomerId] = useState<number>(0);
  const [items, setItems] = useState<QuotationItemCreateDto[]>([]);

  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [taxPercent, setTaxPercent] = useState<number>(0);

  // Tránh add trùng khi dialog mở lại
  const lastSelectedIdRef = useRef<number | null>(null);

  // Load dữ liệu ban đầu
  useEffect(() => {
    Promise.all([
      customerService.getAll(),
      materialService.getAll(),
      productService.getAll(),
    ]).then(([cust, mat, prod]) => {
      setCustomers(cust);
      setMaterials(mat);
      setProducts(prod);
    });
  }, []);

  // Tự động thêm dòng khi chọn ảnh từ dialog
  useEffect(() => {
    if (!selectedProductFromDialog) return;

    if (lastSelectedIdRef.current === selectedProductFromDialog.id) return;

    lastSelectedIdRef.current = selectedProductFromDialog.id;

    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    setItems((prev) => [
      ...prev,
      {
        productName: selectedProductFromDialog.name,
        width: selectedProductFromDialog.defaultWidth,
        height: selectedProductFromDialog.defaultHeight,
        depth: selectedProductFromDialog.defaultDepth,
        materialId: selectedProductFromDialog.defaultMaterialId,
        quantity: 1,
      },
    ]);
  }, [selectedProductFromDialog]);

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        productName: "",
        width: 0,
        height: 0,
        depth: 0,
        materialId: 0,
        quantity: 1,
      },
    ]);
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateItem = (
    index: number,
    field: keyof QuotationItemCreateDto,
    value: string | number
  ) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]:
          field === "width" ||
          field === "height" ||
          field === "depth" ||
          field === "quantity" ||
          field === "materialId"
            ? Number(value)
            : value,
      };
      return updated;
    });
  };

  const handleSelectTemplate = (index: number, templateId: number) => {
    const template = products.find((p) => p.id === templateId);
    if (!template) return;

    setItems((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        productName: template.name,
        width: template.defaultWidth,
        height: template.defaultHeight,
        depth: template.defaultDepth,
        materialId: template.defaultMaterialId,
      };
      return updated;
    });
  };

  // Tính tổng tiền hàng (SubTotal)
  const subTotal = items.reduce((sum, item) => {
    const material = materials.find((m) => m.id === item.materialId);
    // Công thức: (Dài x Cao / 1tr) * Giá vật tư
    const unitPrice = material
      ? ((item.width * item.height) / 1_000_000) * material.unitPrice
      : 0;
    return sum + unitPrice * item.quantity;
  }, 0);

  // Tính chiết khấu, thuế, tổng cộng
  const discountAmount = subTotal * (discountPercent / 100);
  const afterDiscount = subTotal - discountAmount;
  const taxAmount = afterDiscount * (taxPercent / 100);
  const grandTotal = afterDiscount + taxAmount;

  // --- 6. SUBMIT ---
  const handleSubmit = () => {
    if (!customerId) return alert(t('quotations:noCustomerSelected'));
    if (!items.length) return alert(t('quotations:emptyQuotation'));

    // Chuẩn bị dữ liệu items kèm theo Giá Snapshot (quan trọng cho Backend)
    const itemsWithSnapshot = items.map((item) => {
      const material = materials.find((m) => m.id === item.materialId);
      const unitPriceSnapshot = material
        ? ((item.width * item.height) / 1_000_000) * material.unitPrice
        : 0;

      return {
        ...item,
        unitPriceSnapshot: unitPriceSnapshot, // Gửi giá tại thời điểm tạo lên Server
      };
    });

    onSubmit({
      customerId,
      items: itemsWithSnapshot,
      discountPercent, // Gửi % Chiết khấu
      taxPercent, // Gửi % Thuế
    });
  };

  return (
    <Box>
      {/* I. THÔNG TIN KHÁCH HÀNG */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" color="primary" gutterBottom>
            {t('quotations:customerInformation')}
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                select
                fullWidth
                size="small"
                label={t('quotations:customer')}
                value={customerId}
                onChange={(e) => setCustomerId(Number(e.target.value))}
              >
                <MenuItem value={0}>-- {t('quotations:selectCustomer')} --</MenuItem>
                {customers.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* II. CHI TIẾT SẢN PHẨM */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography variant="h6" color="primary">
            {t('quotations:productDetails')}
          </Typography>
          <Typography variant="h6" color="error">
            TỔNG: {formatCurrency(grandTotal)}
          </Typography>
        </Box>

        <Table size="small">
          <TableHead sx={{ bgcolor: "#f0f0f0" }}>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>{t('quotations:product')}</TableCell>
              <TableCell>{t('quotations:width')}</TableCell>
              <TableCell>{t('quotations:height')}</TableCell>
              <TableCell>{t('quotations:material')}</TableCell>
              <TableCell>{t('quotations:quantity')}</TableCell>
              <TableCell>{t('quotations:totalPrice')}</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item, index) => {
              const material = materials.find((m) => m.id === item.materialId);
              const unitPrice = material
                ? ((item.width * item.height) / 1_000_000) * material.unitPrice
                : 0;

              return (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <TextField
                      select
                      size="small"
                      fullWidth
                      variant="standard"
                      value={0}
                      onChange={(e) =>
                        handleSelectTemplate(index, Number(e.target.value))
                      }
                      sx={{ mb: 1 }}
                    >
                      <MenuItem value={0} disabled>
                        -- {t('quotations:selectQuickly')} --
                      </MenuItem>
                      {products.map((p) => (
                        <MenuItem key={p.id} value={p.id}>
                          {p.name}
                        </MenuItem>
                      ))}
                    </TextField>
                    <TextField
                      size="small"
                      fullWidth
                      value={item.productName}
                      placeholder={t('quotations:productName')}
                      onChange={(e) =>
                        updateItem(index, "productName", e.target.value)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      size="small"
                      value={item.width}
                      onChange={(e) =>
                        updateItem(index, "width", e.target.value)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      size="small"
                      value={item.height}
                      onChange={(e) =>
                        updateItem(index, "height", e.target.value)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      select
                      size="small"
                      fullWidth
                      value={item.materialId}
                      onChange={(e) =>
                        updateItem(index, "materialId", e.target.value)
                      }
                    >
                      {materials.map((m) => (
                        <MenuItem key={m.id} value={m.id}>
                          {m.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      size="small"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(index, "quantity", e.target.value)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    {formatCurrency(unitPrice * item.quantity)}
                  </TableCell>
                  <TableCell>
                    <IconButton color="error" onClick={() => removeItem(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}

            {!items.length && (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                  {t('quotations:noProductSelected')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
          <Button startIcon={<AddIcon />} variant="outlined" onClick={addItem}>
            {t('quotations:addRow')}
          </Button>
          <Button
            startIcon={<GridViewIcon />}
            variant="contained"
            color="secondary"
            onClick={onOpenSelector}
          >
            {t('quotations:selectFromLibrary')}
          </Button>
        </Box>
        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
          <Paper
            elevation={0}
            sx={{ width: 350, bgcolor: "#f9f9f9", p: 2, borderRadius: 2 }}
          >
            {/* 1. Tạm tính */}
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography color="text.secondary">{t('quotations:subTotal')}:</Typography>
              <Typography fontWeight="bold">
                {formatCurrency(subTotal)}
              </Typography>
            </Box>

            {/* 2. Chiết khấu */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={1}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <Typography color="text.secondary">{t('quotations:discount')}:</Typography>
                <TextField
                  type="number"
                  variant="standard"
                  size="small"
                  sx={{ width: 50, input: { textAlign: "right" } }}
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(Number(e.target.value))}
                  inputProps={{ min: 0, max: 100 }}
                />
              </Box>
              <Typography color="error">
                - {formatCurrency(discountAmount)}
              </Typography>
            </Box>

            {/* 3. Thuế VAT */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <Typography color="text.secondary">{t('quotations:tax')}:</Typography>
                <TextField
                  type="number"
                  variant="standard"
                  size="small"
                  sx={{ width: 50, input: { textAlign: "right" } }}
                  value={taxPercent}
                  onChange={(e) => setTaxPercent(Number(e.target.value))}
                  inputProps={{ min: 0, max: 100 }}
                />
              </Box>
              <Typography color="primary">
                + {formatCurrency(taxAmount)}
              </Typography>
            </Box>

            <Divider sx={{ mb: 1 }} />

            {/* 4. TỔNG CỘNG */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6" fontWeight="bold">
                {t('quotations:total')}:
              </Typography>
              <Typography variant="h5" fontWeight="bold" color="primary">
                {formatCurrency(grandTotal)}
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Paper>

      <Box textAlign="right">
        <Button variant="contained" size="large" onClick={handleSubmit}>
          {t('quotations:saveQuotation')}
        </Button>
      </Box>
    </Box>
  );
};
