import fs from 'fs';
import xlsx from 'xlsx';

// Biến lưu trữ dữ liệu tạm thời
let transactions = [];

// API Upload file Excel
export const uploadFile = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    // Đọc dữ liệu từ file Excel
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    transactions = xlsx.utils.sheet_to_json(worksheet, {
        header: 1, // Đọc tất cả dữ liệu, sử dụng hàng đầu tiên làm tiêu đề
        range: 7, // Bắt đầu từ hàng thứ 8 (0-indexed)
        defval: '' // Đặt giá trị mặc định cho các ô trống
    });

    // // Sau khi xử lý, có thể xóa file để giải phóng dung lượng
    // fs.unlinkSync(req.file.path);

    return res.status(200).json({
        message: 'File uploaded and data processed successfully',
        data: transactions.slice(0)  // Trả về data đã trích xuất từ file Excel (nếu cần)
    });
};
