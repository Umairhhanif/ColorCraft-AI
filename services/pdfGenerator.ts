import { BookState } from "../types";

export const generatePDF = (book: BookState) => {
  const { jsPDF } = window.jspdf;
  
  // Create new PDF document (portrait, mm, a4)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  // Calculate image height maintaining 3:4 ratio relative to content width, or max height available
  // 3:4 ratio means height = width * (4/3)
  let imgHeight = contentWidth * (4/3);
  
  if (imgHeight > (pageHeight - 60)) {
    imgHeight = pageHeight - 60;
  }
  
  const imgWidth = imgHeight * (3/4);
  const xOffset = (pageWidth - imgWidth) / 2;

  // --- COVER PAGE ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text(`${book.childName}'s`, pageWidth / 2, 30, { align: 'center' });
  doc.setFontSize(32);
  doc.setTextColor(14, 165, 233); // Brand blue
  doc.text(`${book.theme}`, pageWidth / 2, 45, { align: 'center' });
  doc.text("Adventure", pageWidth / 2, 58, { align: 'center' });
  
  if (book.cover.imageUrl) {
    try {
      doc.addImage(book.cover.imageUrl, 'JPEG', xOffset, 70, imgWidth, imgHeight);
    } catch (e) {
      console.error("Error adding cover image", e);
    }
  }
  
  doc.setFontSize(12);
  doc.setTextColor(100);
  doc.text("Created with ColorCraft AI", pageWidth / 2, pageHeight - 10, { align: 'center' });

  // --- PAGES ---
  book.pages.forEach((page, index) => {
    if (page.imageUrl) {
      doc.addPage();
      
      // Page Number
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text(`Page ${index + 1}`, pageWidth / 2, 15, { align: 'center' });

      // Image
      try {
        doc.addImage(page.imageUrl, 'JPEG', xOffset, 25, imgWidth, imgHeight);
      } catch (e) {
        console.error(`Error adding page ${index} image`, e);
      }
      
      // Caption/Description (Optional, at bottom)
      doc.setFontSize(12);
      doc.setTextColor(50);
      const splitText = doc.splitTextToSize(page.description, contentWidth);
      doc.text(splitText, pageWidth / 2, 25 + imgHeight + 15, { align: 'center' });
    }
  });

  // Save
  doc.save(`${book.childName}_${book.theme.replace(/\s+/g, '_')}_ColoringBook.pdf`);
};