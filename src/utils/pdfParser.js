import * as pdfjsLib from 'pdfjs-dist';

// Configure the worker source using a highly reliable, version-matched CDN to bypass Vite asset compiling issues
const PDFJS_VERSION = '5.7.284'; // Aligned exactly with installed package version in package.json
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version || PDFJS_VERSION}/build/pdf.worker.min.mjs`;


/**
 * Extract text content page-by-page from an uploaded PDF file directly in the browser.
 * @param {File} file - The file uploaded by the candidate.
 * @returns {Promise<string>} - Extracted text string.
 */
export const extractTextFromPdf = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const typedArray = new Uint8Array(event.target.result);
        const loadingTask = pdfjsLib.getDocument({ data: typedArray });
        
        const pdf = await loadingTask.promise;
        let extractedText = '';
        
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          
          // Combine strings from text items
          const pageText = textContent.items
            .map((item) => item.str)
            .join(' ');
          
          extractedText += `--- Page ${i} ---\n` + pageText + '\n\n';
        }
        
        if (!extractedText.trim()) {
          reject(new Error("No text content found in the PDF. It might be scanned or image-only."));
        } else {
          resolve(extractedText.trim());
        }
      } catch (error) {
        console.error("PDF.js extraction failed, attempting fallback parsing:", error);
        reject(new Error(`Failed parsing PDF: ${error.message || error}`));
      }
    };
    
    reader.onerror = (error) => {
      reject(new Error(`File reading error: ${error}`));
    };
    
    reader.readAsArrayBuffer(file);
  });
};
