import PDFDocument from 'pdfkit';

export async function generateCertificatePDF(
    name: string,
    programName: string,
    trackName: string | undefined,
    date: string,
    code: string
): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({
                layout: 'landscape',
                size: 'A4',
            });

            const buffers: Buffer[] = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                resolve(Buffer.concat(buffers));
            });

            // Background
            doc.rect(0, 0, doc.page.width, doc.page.height).fill('#F8FAFC');

            // Border
            doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).stroke('#3B82F6');

            // Title
            doc.font('Helvetica-Bold')
                .fontSize(40)
                .fillColor('#0F172A')
                .text('Certificate of Completion', 0, 120, { align: 'center' });

            doc.font('Helvetica')
                .fontSize(16)
                .fillColor('#64748B')
                .text('This verifies that', 0, 180, { align: 'center' });

            // Name
            doc.font('Helvetica-Bold')
                .fontSize(36)
                .fillColor('#3B82F6')
                .text(name, 0, 220, { align: 'center' });

            // Program
            doc.font('Helvetica')
                .fontSize(16)
                .fillColor('#64748B')
                .text('has successfully completed the requirements for the', 0, 280, { align: 'center' });

            doc.font('Helvetica-Bold')
                .fontSize(24)
                .fillColor('#1E293B')
                .text(programName, 0, 310, { align: 'center' });

            if (trackName) {
                doc.font('Helvetica-Oblique')
                    .fontSize(18)
                    .fillColor('#475569')
                    .text(`${trackName} Track`, 0, 350, { align: 'center' });
            }

            // Footer
            doc.font('Helvetica')
                .fontSize(12)
                .fillColor('#94A3B8')
                .text(`Date Issued: ${date}`, 60, doc.page.height - 80);

            doc.text(`Verify at: https://sparkfish.app/certificate/verify/${code}`, doc.page.width - 350, doc.page.height - 80);

            const logoTextY = doc.page.height - 120;
            doc.font('Helvetica-Bold').fontSize(24).fillColor('#0F172A').text('Sparkfish', 0, logoTextY, { align: 'center' });

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
}
