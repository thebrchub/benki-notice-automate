import { jsPDF } from "jspdf";

// --- HELPER: Load Image Async ---
const loadImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
  });
};

export const generateCasePDF = async (data) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth(); // ~210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // ~297mm
  const margin = 15;
  const maxLineWidth = pageWidth - (margin * 2);
  
  let yPos = 15; // Start at top

  // --- 1. HEADER IMAGE LOGIC (Page 1 Only) ---
  try {
    const bannerUrl = "/banner/1.webp"; 
    const img = await loadImage(bannerUrl);

    // Calculate Aspect Ratio to fit Width
    const imgProps = doc.getImageProperties(img);
    const imgWidth = pageWidth - (margin * 2);
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

    doc.addImage(img, 'WEBP', margin, yPos, imgWidth, imgHeight);
    yPos += imgHeight + 6; 

    // Add Website Link Below Image
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 255); // Blue
    const linkText = "www.casanketmjoshi.in";
    const textWidth = doc.getTextWidth(linkText);
    const xCentered = (pageWidth - textWidth) / 2;

    doc.textWithLink(linkText, xCentered, yPos, { url: "https://www.casanketmjoshi.in" });
    
    // Underline
    doc.setDrawColor(0, 0, 255);
    doc.setLineWidth(0.1);
    doc.line(xCentered, yPos + 1, xCentered + textWidth, yPos + 1);

    doc.setTextColor(0); // Reset to Black
    yPos += 15; 

  } catch (error) {
    console.warn("Banner failed to load, falling back to text.", error);
    yPos += 10;
  }

  // --- 2. FOOTER LOGIC (Updated with Disclaimer) ---
  const addFooter = () => {
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      
      // Footer Line
      doc.setDrawColor(200); 
      doc.setLineWidth(0.1);
      doc.line(margin, pageHeight - 20, pageWidth - margin, pageHeight - 20);

      // Disclaimer Text
      doc.setFont("helvetica", "italic");
      doc.setFontSize(7); // Smaller font for disclaimer
      doc.setTextColor(100); // Grey text
      
      const disclaimer = "Disclaimer : The information provided in this document is for general informational purposes only and does not constitute legal advice. Therefore, any reliance on such information is strictly at reader’s own risk.";
      const splitDisclaimer = doc.splitTextToSize(disclaimer, maxLineWidth);
      
      doc.text(splitDisclaimer, pageWidth / 2, pageHeight - 15, { align: "center" });
      
      // Page Number
      doc.setFontSize(8);
      doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 8, { align: "right" });
    }
  };

  // --- 3. PAGE BREAK CHECKER ---
  const checkPageBreak = (heightToAdd) => {
    // Safety limit 265mm to avoid hitting the new taller footer
    if (yPos + heightToAdd > 265) { 
      doc.addPage();
      yPos = 20; 
    }
  };

  // --- 4. SECTION HELPER (With Justify Option) ---
  const addSection = (title, content, justify = false) => {
    if (!content) return;
    
    checkPageBreak(15); 
    
    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text(title, margin, yPos);
    yPos += 6;

    // Content
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    
    // We use splitTextToSize to calculate the HEIGHT required
    const splitText = doc.splitTextToSize(content, maxLineWidth);
    const blockHeight = splitText.length * 5;

    if (blockHeight < 200) {
        checkPageBreak(blockHeight);
    }

    if (justify) {
        // ✅ JUSTIFIED ALIGNMENT
        // Note: 'maxWidth' is required for 'align: justify' to work in jsPDF
        doc.text(content, margin, yPos, { maxWidth: maxLineWidth, align: "justify" });
    } else {
        // Standard Left Alignment (Better for short lists/names)
        doc.text(splitText, margin, yPos);
    }
    
    yPos += blockHeight + 6; 
  };

  // --- 5. SMART SUMMARY (Justified) ---
  const addSmartSummary = (fullText) => {
      if (!fullText) return;

      checkPageBreak(20);
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Detailed Analysis:", margin, yPos);
      yPos += 8;

      doc.setFontSize(10);

      const paragraphs = fullText.split('\n').filter(p => p.trim() !== "");

      paragraphs.forEach(para => {
          const regex = /^(Facts|Arguments|Observation|Conclusion|Held|Decision|Note|Issue|Observations|Ratio\/Reasoning)[:\s-]/i;
          const match = para.match(regex);

          if (match) {
              const keyword = match[0]; 
              const content = para.replace(keyword, "").trim(); 
              
              // Calculate height using raw text length approximation for simplicity + safety buffer
              const splitContent = doc.splitTextToSize(content, maxLineWidth);
              const blockHeight = 5 + (splitContent.length * 5) + 4;
              
              checkPageBreak(blockHeight > 50 ? 20 : blockHeight);

              // Keyword (Bold)
              doc.setFont("helvetica", "bold");
              doc.text(keyword, margin, yPos);
              yPos += 5;
              
              // Content (Normal & Justified)
              doc.setFont("helvetica", "normal");
              // ✅ JUSTIFIED
              doc.text(content, margin, yPos, { maxWidth: maxLineWidth, align: "justify" });
              
              yPos += (splitContent.length * 5) + 4; 

          } else {
              // Normal Paragraph
              doc.setFont("helvetica", "normal");
              
              const splitText = doc.splitTextToSize(para, maxLineWidth);
              checkPageBreak(splitText.length * 5);
              
              // ✅ JUSTIFIED
              doc.text(para, margin, yPos, { maxWidth: maxLineWidth, align: "justify" });
              yPos += (splitText.length * 5) + 4;
          }
      });
  };

  // ==========================================
  // DOCUMENT GENERATION FLOW
  // ==========================================

  // 1. MAIN TITLE
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0);
  const titleLines = doc.splitTextToSize(data.citation_number || "Case Analysis Report", maxLineWidth);
  doc.text(titleLines, margin, yPos);
  yPos += (titleLines.length * 8) + 5;

  // 2. METADATA
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  
  doc.text(`Bench: ${data.bench_name || 'N/A'}`, margin, yPos);
  doc.text(`AY: ${data.assessment_year || 'N/A'}`, margin + 100, yPos);
  yPos += 6;
  
  doc.text(`Date: ${data.date_of_pronouncement || 'N/A'}`, margin, yPos);
  doc.text(`Outcome: ${data.appeal_in_favor_of || 'Pending'}`, margin + 100, yPos);
  yPos += 8;

  // Divider
  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 10;

  // 3. PARTIES
  doc.setFont("helvetica", "bold");
  doc.text("Parties Involved", margin, yPos);
  yPos += 6;
  doc.setFont("helvetica", "normal");
  
  const appLines = doc.splitTextToSize(`Appellant: ${data.appellant}`, maxLineWidth);
  doc.text(appLines, margin, yPos);
  yPos += (appLines.length * 5) + 2;

  const resLines = doc.splitTextToSize(`Respondent: ${data.respondent}`, maxLineWidth);
  doc.text(resLines, margin, yPos);
  yPos += (resLines.length * 5) + 8;

  // 4. DETAILS (Left Aligned usually looks better for short fields)
  addSection("Coram (Judges):", `${data.judicial_member || '-'} (JM), ${data.accountant_member || '-'} (AM)`);
  addSection("Representation:", `Appellant Rep: ${data.appellant_representative || 'None'}\nDepartment Rep: ${data.departmental_representative || 'None'}`);
  addSection("Sections Involved:", Array.isArray(data.sections_involved) ? data.sections_involved.join(', ') : data.sections_involved);
  addSection("Case Laws Referred:", data.case_laws_referred);

  yPos += 2;
  doc.setLineWidth(0.1);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 8;

  // 5. SUMMARIES (✅ Justified)
  // Passing 'true' as 3rd argument to enable justification
  addSection("Quick Summary:", data.four_line_summary, true);
  
  if(data.issues_involved) {
      addSection("Issues Involved:", data.issues_involved, true);
  }
  
  // Smart Analysis handles justification internally now
  addSmartSummary(data.detailed_summary);

  // --- FINALIZE ---
  addFooter();
  doc.save(`${data.citation_number ? data.citation_number.replace(/[^a-zA-Z0-9]/g, '_') : 'LawWise_Report'}.pdf`);
};