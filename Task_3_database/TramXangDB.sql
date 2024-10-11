CREATE DATABASE TramXangDB;

CREATE TABLE TramXang (
    MaTram INT PRIMARY KEY,
    TenTram NVARCHAR(100) NOT NULL,
    DiaChi NVARCHAR(255) NOT NULL
);

CREATE TABLE HangHoa (
    MaHang INT PRIMARY KEY,
    TenHang NVARCHAR(50) NOT NULL,
    DonGia DECIMAL(10, 2) NOT NULL
);

CREATE TABLE TruBom (
    MaTru INT PRIMARY KEY,
    MaTram INT,
    MaHang INT,
    SoLuongTon DECIMAL(10, 2) NOT NULL DEFAULT 0,
    FOREIGN KEY (MaTram) REFERENCES TramXang(MaTram),
    FOREIGN KEY (MaHang) REFERENCES HangHoa(MaHang)
);

CREATE TABLE GiaoDich (
    MaGD INT PRIMARY KEY,
    MaTru INT,
    NgayGio DATETIME NOT NULL,
    SoLuong DECIMAL(10, 2) NOT NULL,
    GiaTri DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (MaTru) REFERENCES TruBom(MaTru),
    CHECK (SoLuong > 0),
    CHECK (GiaTri > 0)
);

-- Tạo các index
CREATE INDEX IX_TruBom_MaTram ON TruBom(MaTram);
CREATE INDEX IX_TruBom_MaHang ON TruBom(MaHang);
CREATE INDEX IX_TruBom_MaTram_MaHang ON TruBom(MaTram, MaHang);

CREATE INDEX IX_GiaoDich_MaTru ON GiaoDich(MaTru);
CREATE INDEX IX_GiaoDich_MaTru_NgayGio ON GiaoDich(MaTru, NgayGio);