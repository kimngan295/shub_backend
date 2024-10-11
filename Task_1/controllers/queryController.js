import fs from 'fs';
import path from 'path';
import xlsx from 'xlsx';

// Hàm để lấy file Excel mới nhất trong thư mục uploads
const getLatestFile = (directory) => {
    const files = fs.readdirSync(directory);
    const fileStats = files.map(file => {
        const filePath = path.join(directory, file);
        return {
            file,
            mtime: fs.statSync(filePath).mtime // Thời gian sửa đổi
        };
    });
    fileStats.sort((a, b) => b.mtime - a.mtime); // Sắp xếp theo thời gian sửa đổi giảm dần
    return fileStats.length > 0 ? fileStats[0].file : null; // Trả về file mới nhất
};

export const queryTransactions = (req, res) => {
    const { startTime, endTime } = req.query;

    if (!startTime || !endTime) {
        return res.status(400).json({ message: 'Invalid time range' });
    }

    // Lấy file Excel mới nhất trong thư mục uploads
    const latestFile = getLatestFile('uploads/');
    if (!latestFile) {
        return res.status(404).json({ message: 'No files found' });
    }

    // Đọc dữ liệu từ file Excel
    const workbook = xlsx.readFile(path.join('uploads/', latestFile));
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Chuyển đổi dữ liệu từ sheet thành JSON
    let transactions = xlsx.utils.sheet_to_json(worksheet, { header: 1 }); // Sử dụng header: 1 để lấy toàn bộ dữ liệu

    // Bỏ qua các dòng không cần thiết (các dòng trước khi có tiêu đề)
    const headerRowIndex = 7; // Dòng tiêu đề bắt đầu từ dòng thứ 8 (index 7)
    const header = transactions[headerRowIndex]; // Lấy tiêu đề

    // Lấy dữ liệu giao dịch từ các dòng sau tiêu đề
    transactions = transactions.slice(headerRowIndex + 1).map(row => {
        return {
            STT: row[0] || '', // Nếu không có giá trị thì lưu là ''
            Ngày: row[1] || '',
            Giờ: row[2] || '',
            Trạm: row[3] || '',
            Trụ_bơm: row[4] || '',
            Mặt_hàng: row[5] || '',
            Số_lượng: row[6] || '',
            Đơn_giá: row[7] || '',
            Thành_tiền: row[8] || '',
            Trạng_thái_thanh_toán: row[9] || '',
            Mã_khách_hàng: row[10] || '',
            Tên_khách_hàng: row[11] || '',
            Loại_khách_hàng: row[12] || '',
            Ngày_thanh_toán: row[13] || '',
            Nhân_viên: row[14] || '',
            Biển_số_xe: row[15] || '',
            Trạng_thái_hoá_đơn: row[16] || ''
        };
    }).filter(row => row.Ngày); // Lọc bỏ các dòng không có dữ liệu Ngày

    // console.log(transactions)

    // Lọc dữ liệu theo giờ
    const filteredData = transactions.filter(item => {
        // console.log("giờ: " + item[2])
        const transactionHour = item['Giờ'].split(':')[0]; 
        return transactionHour >= startTime && transactionHour <= endTime;
    });
    
    console.log(startTime, ' ', endTime)
    console.log(filteredData)

    return res.status(200).json({
        message: 'Transactions retrieved successfully',
        data: filteredData
    });
};
