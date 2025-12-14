import { useState } from 'react';
import { 
    Dialog, DialogTitle, DialogContent, DialogActions, Button, 
    Card, CardActionArea, CardMedia, CardContent, Typography, 
    TextField, InputAdornment 
} from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import SearchIcon from '@mui/icons-material/Search';
import type { ProductTemplate } from '../../products/types';

interface Props {
    open: boolean;
    products: ProductTemplate[];
    onClose: () => void;
    onSelect: (product: ProductTemplate) => void;
}

export const ProductSelectorDialog = ({ open, products, onClose, onSelect }: Props) => {
    const [searchTerm, setSearchTerm] = useState('');

    // Lọc sản phẩm theo từ khóa tìm kiếm
    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ bgcolor: '#f5f5f5', pb: 1 }}>
                Chọn Sản Phẩm Từ Thư Viện
                <TextField 
                    fullWidth variant="outlined" size="small" 
                    placeholder="Tìm kiếm sản phẩm..." sx={{ mt: 2, bgcolor: 'white' }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start"><SearchIcon /></InputAdornment>
                        ),
                    }}
                />
            </DialogTitle>
            
            <DialogContent sx={{ bgcolor: '#f0f2f5', p: 2 }}>
                <Grid container spacing={2} sx={{ mt: 0.5 }}>
                    {filteredProducts.map((item) => (
                        <Grid item xs={6} sm={4} md={3} key={item.id}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <CardActionArea 
                                    sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
                                    onClick={() => { onSelect(item); onClose(); }}
                                >
                                    {/* Hiển thị ảnh */}
                                    <CardMedia
                                        component="img"
                                        height="120"
                                        image={item.imageUrl || "https://via.placeholder.com/150?text=No+Image"} // Ảnh mặc định nếu null
                                        alt={item.name}
                                        sx={{ objectFit: 'contain', p: 1, bgcolor: 'white' }}
                                    />
                                    <CardContent sx={{ flexGrow: 1, bgcolor: '#fff', borderTop: '1px solid #eee' }}>
                                        <Typography variant="subtitle2" fontWeight="bold" sx={{ lineHeight: 1.2 }}>
                                            {item.name}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            KT: {item.defaultWidth}x{item.defaultHeight}x{item.defaultDepth}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                    
                    {filteredProducts.length === 0 && (
                        <Grid item xs={12}>
                            <Typography align="center" sx={{ mt: 4, color: 'text.secondary' }}>
                                Không tìm thấy sản phẩm nào.
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            </DialogContent>
            
            <DialogActions>
                <Button onClick={onClose} color="inherit">Đóng</Button>
            </DialogActions>
        </Dialog>
    );
};