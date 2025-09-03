const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$connect();
    console.log('Kết nối database QuanLyDatDai thành công!');
    
    // Test với bảng có sẵn
    const userCount = await prisma.nguoi_dung.count();
    console.log(`Số lượng người dùng: ${userCount}`);
    
    const landCount = await prisma.thua_dat.count();
    console.log(`Số lượng thửa đất: ${landCount}`);
    
  } catch (error) {
    console.error('Lỗi kết nối:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();