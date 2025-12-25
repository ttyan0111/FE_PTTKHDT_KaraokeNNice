import jsPDF from 'jspdf';
import type { BookingRecord } from '../components/Receptionist/ReceptionistHistory';

/**
 * Generate PDF invoice for a booking
 * @param booking - Booking record to generate invoice for
 */
export const generateInvoicePDF = (booking: BookingRecord) => {
    const doc = new jsPDF();

    // Set font
    doc.setFont('helvetica');

    // Header
    doc.setFontSize(20);
    doc.setTextColor(0, 247, 255);
    doc.text('KARAOKE NNICE', 105, 20, { align: 'center' });

    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('BOOKING INVOICE', 105, 35, { align: 'center' });

    // Invoice info
    doc.setFontSize(11);
    doc.text(`Invoice No: #${booking.maPhieuDat}`, 20, 50);
    doc.text(`Date: ${new Date(booking.gioDat).toLocaleDateString('en-US')}`, 20, 58);

    // Divider line
    doc.setDrawColor(0, 247, 255);
    doc.setLineWidth(0.5);
    doc.line(20, 65, 190, 65);

    // Customer info
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('CUSTOMER INFORMATION', 20, 75);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text(`Customer Name: ${booking.tenKH}`, 20, 85);
    doc.text(`Phone Number: ${booking.sdt}`, 20, 93);

    // Booking details
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('BOOKING DETAILS', 20, 108);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text(`Room: ${booking.tenPhong}`, 20, 118);
    doc.text(`Start Time: ${new Date(booking.gioDat).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}`, 20, 126);
    doc.text(`End Time: ${new Date(booking.gioKetThuc).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}`, 20, 134);
    doc.text(`Duration: ${booking.duration} hours`, 20, 142);

    if (booking.ghiChu) {
        doc.text(`Note: ${booking.ghiChu}`, 20, 150);
    }

    // Divider line
    doc.line(20, 160, 190, 160);

    // Total
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(255, 77, 79);
    const totalAmount = booking.tongTien > 0 ? booking.tongTien.toLocaleString('en-US') : 'TBD';
    doc.text(`TOTAL: ${totalAmount} VND`, 20, 175);

    // Status
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(`Status: ${getStatusTextEnglish(booking.trangThai)}`, 20, 185);

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text('Thank you for choosing our service!', 105, 270, { align: 'center' });
    doc.text('Karaoke NNice - Where Music and Passion Unite', 105, 278, { align: 'center' });

    // Save PDF
    const fileName = `Invoice_${booking.maPhieuDat}_${new Date().getTime()}.pdf`;
    doc.save(fileName);
};

/**
 * Get English status text
 */
const getStatusTextEnglish = (status: string): string => {
    const statusMap: { [key: string]: string } = {
        'Pending': 'Pending Confirmation',
        'Confirmed': 'Confirmed',
        'Completed': 'Completed',
        'Cancelled': 'Cancelled'
    };
    return statusMap[status] || status;
};

/**
 * Generate Excel invoice (future implementation)
 */
export const generateInvoiceExcel = (booking: BookingRecord) => {
    // TODO: Implement Excel generation using xlsx library
    console.log('Excel generation not yet implemented', booking);
};
