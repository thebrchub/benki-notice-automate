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

// ✅ NUCLEAR TEXT CLEANER
// Fixes "1 0 0 , 0 0 0" -> "100,000" and removes hidden ghost spaces
const cleanText = (text) => {
  if (!text) return "";
  
  // 1. Normalize Unicode: Converts strange space characters (NBSP) to standard spaces
  let cleaned = text.normalize("NFKC");

  // 2. Fix Broken Numbers: "1 9" -> "19"
  // Handles standard spaces (\s) and Non-Breaking Spaces (\u00A0)
  cleaned = cleaned.replace(/(\d)[\s\u00A0]+(?=\d)/g, '$1');
  cleaned = cleaned.replace(/(\d)[\s\u00A0]+(?=\d)/g, '$1'); // Run twice for "1 2 3"

  // 3. Fix Punctuation in Numbers: "1 , 000" -> "1,000" or "Rs . 500" -> "Rs.500"
  cleaned = cleaned.replace(/(\d)[\s\u00A0]+(?=[,.])/g, '$1'); // Digit -> Punctuation
  cleaned = cleaned.replace(/([,.])[\s\u00A0]+(?=\d)/g, '$1'); // Punctuation -> Digit

  // 4. Collapse Multiple Spaces: "Word    Word" -> "Word Word"
  cleaned = cleaned.replace(/[\s\u00A0]{2,}/g, ' ');

  return cleaned.trim();
};

// ✅ MAIN GENERATOR FUNCTION
export const generateCasePDF = async (data, options = { justify: true }) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth(); // ~210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // ~297mm
  const margin = 15;
  const maxLineWidth = pageWidth - (margin * 2);
  
  // Extract alignment preference (Default to TRUE/Justify if not passed)
  const shouldJustify = options.justify !== undefined ? options.justify : true;

  let yPos = 15; 

  // --- 1. HEADER IMAGE ---
  try {
    const bannerUrl = "/banner/1.webp"; 
    const img = await loadImage(bannerUrl);
    const imgProps = doc.getImageProperties(img);
    const imgWidth = pageWidth - (margin * 2);
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

    doc.addImage(img, 'WEBP', margin, yPos, imgWidth, imgHeight);
    yPos += imgHeight + 6; 

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 255); 
    const linkText = "www.casanketmjoshi.in";
    const textWidth = doc.getTextWidth(linkText);
    const xCentered = (pageWidth - textWidth) / 2;

    doc.textWithLink(linkText, xCentered, yPos, { url: "https://www.casanketmjoshi.in" });
    doc.setDrawColor(0, 0, 255);
    doc.setLineWidth(0.1);
    doc.line(xCentered, yPos + 1, xCentered + textWidth, yPos + 1);
    doc.setTextColor(0); 
    yPos += 15; 

  } catch (error) {
    console.warn("Banner failed to load.", error);
    yPos += 10;
  }

  // --- 2. FOOTER ---
  const addFooter = () => {
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setDrawColor(200); 
      doc.setLineWidth(0.1);
      doc.line(margin, pageHeight - 20, pageWidth - margin, pageHeight - 20);

      doc.setFontSize(7);
      doc.setTextColor(100); 
      const label = "Disclaimer : ";
      const body = "The information provided in this document is for general informational purposes only and does not constitute legal advice. Therefore, any reliance on such information is strictly at reader’s own risk.";
      
      doc.setFont("helvetica", "bolditalic"); 
      const labelWidth = doc.getTextWidth(label);
      
      doc.setFont("helvetica", "italic");
      const availableWidth = maxLineWidth - labelWidth;
      const splitBody = doc.splitTextToSize(body, availableWidth);
      
      const totalBlockWidth = labelWidth + doc.getTextWidth(splitBody[0]);
      const startX = (pageWidth - totalBlockWidth) / 2;

      doc.setFont("helvetica", "bolditalic");
      doc.text(label, startX, pageHeight - 15);

      doc.setFont("helvetica", "italic");
      doc.text(splitBody, startX + labelWidth, pageHeight - 15);
      
      doc.setFont("helvetica", "normal"); 
      doc.setFontSize(8);
      doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 8, { align: "right" });
    }
  };

  const checkPageBreak = (heightToAdd) => {
    if (yPos + heightToAdd > 265) { 
      doc.addPage();
      yPos = 20; 
    }
  };

  // --- 4. SECTION HELPER (Clean + Toggle) ---
  const addSection = (title, content, isSummarySection = false) => {
    if (!content) return;
    
    // ✅ STEP 1: CLEAN THE TEXT
    const cleanedContent = cleanText(content);

    checkPageBreak(15); 
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text(title, margin, yPos);
    yPos += 6;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    
    // ✅ STEP 2: CALCULATE HEIGHT USING CLEANED TEXT
    const splitText = doc.splitTextToSize(cleanedContent, maxLineWidth);
    const blockHeight = splitText.length * 5;

    if (blockHeight < 200) {
        checkPageBreak(blockHeight);
    }

    // ✅ STEP 3: PRINT (Using Toggle + Cleaned Text)
    if (shouldJustify && isSummarySection) {
        // Justify
        doc.text(cleanedContent, margin, yPos, { maxWidth: maxLineWidth, align: "justify" });
    } else {
        // Left Align (Use the split array to prevent single-line justification issues)
        doc.text(splitText, margin, yPos);
    }
    
    yPos += blockHeight + 6; 
  };

  // --- 5. SMART SUMMARY (Clean + Toggle) ---
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
              let content = para.replace(keyword, "").trim(); 
              
              // ✅ CLEAN CONTENT
              content = cleanText(content);

              const splitContent = doc.splitTextToSize(content, maxLineWidth);
              const blockHeight = 5 + (splitContent.length * 5) + 4;
              
              checkPageBreak(blockHeight > 50 ? 20 : blockHeight);

              doc.setFont("helvetica", "bold");
              doc.text(keyword, margin, yPos);
              yPos += 5;
              
              doc.setFont("helvetica", "normal");
              
              if (shouldJustify) {
                  doc.text(content, margin, yPos, { maxWidth: maxLineWidth, align: "justify" });
              } else {
                  doc.text(splitContent, margin, yPos);
              }
              
              yPos += (splitContent.length * 5) + 4; 

          } else {
              doc.setFont("helvetica", "normal");
              
              // ✅ CLEAN PARA
              const cleanedPara = cleanText(para);
              const splitText = doc.splitTextToSize(cleanedPara, maxLineWidth);
              
              checkPageBreak(splitText.length * 5);
              
              if (shouldJustify) {
                  doc.text(cleanedPara, margin, yPos, { maxWidth: maxLineWidth, align: "justify" });
              } else {
                  doc.text(splitText, margin, yPos);
              }

              yPos += (splitText.length * 5) + 4;
          }
      });
  };

  // ==========================================
  // DOCUMENT GENERATION FLOW
  // ==========================================

  // Main Title
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0);
  const titleLines = doc.splitTextToSize(cleanText(data.citation_number || "Case Analysis Report"), maxLineWidth);
  doc.text(titleLines, margin, yPos);
  yPos += (titleLines.length * 8) + 5;

  // Metadata
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Bench: ${cleanText(data.bench_name || 'N/A')}`, margin, yPos);
  doc.text(`AY: ${cleanText(data.assessment_year || 'N/A')}`, margin + 100, yPos);
  yPos += 6;
  doc.text(`Date: ${cleanText(data.date_of_pronouncement || 'N/A')}`, margin, yPos);
  doc.text(`Outcome: ${cleanText(data.appeal_in_favor_of || 'Pending')}`, margin + 100, yPos);
  yPos += 8;

  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 10;

  // Parties (Cleaned!)
  doc.setFont("helvetica", "bold");
  doc.text("Parties Involved", margin, yPos);
  yPos += 6;
  doc.setFont("helvetica", "normal");
  
  const appLines = doc.splitTextToSize(`Appellant: ${cleanText(data.appellant)}`, maxLineWidth);
  doc.text(appLines, margin, yPos);
  yPos += (appLines.length * 5) + 2;

  const resLines = doc.splitTextToSize(`Respondent: ${cleanText(data.respondent)}`, maxLineWidth);
  doc.text(resLines, margin, yPos);
  yPos += (resLines.length * 5) + 8;

  // Details
  addSection("Coram (Judges):", `${data.judicial_member || '-'} (JM), ${data.accountant_member || '-'} (AM)`);
  addSection("Representation:", `Appellant Rep: ${data.appellant_representative || 'None'}\nDepartment Rep: ${data.departmental_representative || 'None'}`);
  addSection("Sections Involved:", Array.isArray(data.sections_involved) ? data.sections_involved.join(', ') : data.sections_involved);
  addSection("Case Laws Referred:", data.case_laws_referred);

  yPos += 2;
  doc.setLineWidth(0.1);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 8;

  // Summaries (Toggle Enabled via 'true' argument)
  addSection("Quick Summary:", data.four_line_summary, true);
  
  if(data.issues_involved) {
      addSection("Issues Involved:", data.issues_involved, true);
  }
  
  addSmartSummary(data.detailed_summary);

  addFooter();
  doc.save(`${data.citation_number ? data.citation_number.replace(/[^a-zA-Z0-9]/g, '_') : 'LawWise_Report'}.pdf`);
};