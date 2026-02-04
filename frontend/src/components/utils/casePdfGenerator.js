import { jsPDF } from "jspdf";

export const generateCasePDF = (data) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  const maxLineWidth = pageWidth - (margin * 2);
  let yPos = 20;

  // --- HELPER: Check Page Break ---
  const checkPageBreak = (heightToAdd) => {
    if (yPos + heightToAdd > 280) { // A4 height is ~297mm
      doc.addPage();
      yPos = 20;
    }
  };

  // --- HELPER: Add Standard Section ---
  const addSection = (title, content) => {
    if (!content) return;
    
    checkPageBreak(20);
    
    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(title, margin, yPos);
    yPos += 6;

    // Content
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const splitText = doc.splitTextToSize(content, maxLineWidth);
    
    checkPageBreak(splitText.length * 5);
    doc.text(splitText, margin, yPos);
    yPos += (splitText.length * 5) + 4; 
  };

  // --- NEW HELPER: Smart Formatted Summary ---
  // This detects "Facts:", "Arguments:", etc. and bolds them!
  const addSmartSummary = (fullText) => {
      if (!fullText) return;

      checkPageBreak(20);
      
      // Section Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("Detailed Analysis:", margin, yPos);
      yPos += 6;

      doc.setFontSize(10);

      // 1. Split by paragraphs
      const paragraphs = fullText.split('\n').filter(p => p.trim() !== "");

      paragraphs.forEach(para => {
          // Regex to find the headers (Same as your frontend logic)
          const regex = /^(Facts|Arguments|Observation|Conclusion|Held|Decision|Note|Issue|Observations|Ratio\/Reasoning)[:\s-]/i;
          const match = para.match(regex);

          if (match) {
              // --- HEADLINE FOUND (e.g. "Facts:") ---
              const keyword = match[0]; // "Facts:"
              const content = para.replace(keyword, "").trim(); // The rest of the text

              // 1. Print Keyword in BOLD
              checkPageBreak(10);
              doc.setFont("helvetica", "bold");
              doc.text(keyword, margin, yPos);
              
              // 2. Move down slightly
              yPos += 5;

              // 3. Print Content in NORMAL
              doc.setFont("helvetica", "normal");
              const splitContent = doc.splitTextToSize(content, maxLineWidth);
              
              checkPageBreak(splitContent.length * 5);
              doc.text(splitContent, margin, yPos);
              
              // Add space after paragraph
              yPos += (splitContent.length * 5) + 4; 

          } else {
              // --- NORMAL PARAGRAPH (No keyword found) ---
              doc.setFont("helvetica", "normal");
              const splitText = doc.splitTextToSize(para, maxLineWidth);
              
              checkPageBreak(splitText.length * 5);
              doc.text(splitText, margin, yPos);
              yPos += (splitText.length * 5) + 4;
          }
      });
  };

  // ==========================================
  // PDF GENERATION FLOW
  // ==========================================

  // --- 1. HEADER ---
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  const titleLines = doc.splitTextToSize(data.citation_number || "Case Analysis Report", maxLineWidth);
  doc.text(titleLines, margin, yPos);
  yPos += (titleLines.length * 7) + 5;

  // --- 2. META DATA ---
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Bench: ${data.bench_name}`, margin, yPos);
  doc.text(`AY: ${data.assessment_year}`, margin + 80, yPos);
  yPos += 6;
  doc.text(`Date: ${data.date_of_pronouncement}`, margin, yPos);
  doc.text(`Outcome: ${data.appeal_in_favor_of}`, margin + 80, yPos);
  yPos += 10;

  doc.setLineWidth(0.5);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 10;

  // --- 3. PARTIES ---
  doc.setFont("helvetica", "bold");
  doc.text("Parties Involved", margin, yPos);
  yPos += 6;
  doc.setFont("helvetica", "normal");
  doc.text(`Appellant:  ${data.appellant}`, margin, yPos);
  yPos += 5;
  doc.text(`Respondent: ${data.respondent}`, margin, yPos);
  yPos += 10;

  // --- 4. LEGAL TEAM ---
  addSection("Coram (Judges):", `${data.judicial_member} (JM), ${data.accountant_member} (AM)`);
  addSection("Representatives:", `Appellant Rep: ${data.appellant_representative}\nDepartment Rep: ${data.departmental_representative}`);

  // --- 5. LEGAL DETAILS ---
  addSection("Sections Involved:", typeof data.sections_involved === 'string' ? data.sections_involved : data.sections_involved?.join(', '));
  addSection("Case Laws Referred:", data.case_laws_referred);

  doc.setLineWidth(0.1);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 10;

  // --- 6. SUMMARIES ---
  addSection("Quick Summary:", data.four_line_summary);
  // Optional: Issues Involved if you have it
  if(data.issues_involved) addSection("Issues Involved:", data.issues_involved);
  
  // ✅ CALL THE NEW SMART FUNCTION HERE
  addSmartSummary(data.detailed_summary);

  // Save
  doc.save(`${data.citation_number ? data.citation_number.replace(/[^a-zA-Z0-9]/g, '_') : 'report'}_Analysis.pdf`);
};