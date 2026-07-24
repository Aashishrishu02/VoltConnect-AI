import PDFDocument from 'pdfkit';

export interface InvoiceData {
  bookingId: string;
  userName: string;
  userEmail: string;
  chargerTitle: string;
  chargerAddress: string;
  startTime: Date;
  endTime: Date;
  totalHours: number;
  totalPrice: number;
  paymentMethod: string;
  status: string;
}

export function generateInvoicePDF(data: InvoiceData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const buffers: Buffer[] = [];

      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      // Header
      doc.fillColor('#059669').fontSize(24).text('ChargeShare EV Network', { align: 'left' });
      doc.fillColor('#6B7280').fontSize(10).text('Official Charging Session Receipt & PDF Invoice', { align: 'left' });
      doc.moveDown(1.5);

      // Divider
      doc.moveTo(50, doc.y).lineTo(550, doc.y).strokeColor('#E5E7EB').stroke();
      doc.moveDown(1);

      // Details Grid
      doc.fillColor('#111827').fontSize(12).text(`Invoice Number: CS-INV-${data.bookingId.slice(0, 8).toUpperCase()}`);
      doc.text(`Date Issued: ${new Date().toLocaleDateString()}`);
      doc.text(`Booking Status: ${data.status}`);
      doc.moveDown(1);

      // Customer & Charger Box
      doc.fillColor('#374151').fontSize(11).text(`Billed To: ${data.userName} (${data.userEmail})`);
      doc.text(`Location: ${data.chargerTitle}`);
      doc.text(`Address: ${data.chargerAddress}`);
      doc.moveDown(1.5);

      // Session Summary Table
      doc.fillColor('#059669').fontSize(14).text('Session Breakdown');
      doc.moveDown(0.5);

      doc.fillColor('#1F2937').fontSize(10);
      doc.text(`Start Time: ${new Date(data.startTime).toLocaleString()}`);
      doc.text(`End Time: ${new Date(data.endTime).toLocaleString()}`);
      doc.text(`Duration: ${data.totalHours.toFixed(2)} hours`);
      doc.text(`Payment Method: ${data.paymentMethod}`);
      doc.moveDown(1);

      doc.moveTo(50, doc.y).lineTo(550, doc.y).strokeColor('#10B981').stroke();
      doc.moveDown(1);

      doc.fillColor('#059669').fontSize(18).text(`Total Paid: $${data.totalPrice.toFixed(2)} USD`, { align: 'right' });
      doc.moveDown(2);

      // Footer
      doc.fillColor('#9CA3AF').fontSize(9).text('Thank you for using ChargeShare! Together we accelerate sustainable mobility.', { align: 'center' });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
