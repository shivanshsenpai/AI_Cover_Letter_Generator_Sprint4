import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Upload, 
  Trash2, 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  Edit3, 
  Eye, 
  Info, 
  AlertCircle, 
  RefreshCw 
} from 'lucide-react';
import { generateCoverLetter } from './services/geminiService';
import { extractTextFromPdf } from './utils/pdfParser';

function App() {
  // Pre-populate fields with default name renamed to Shivansh Sharma
  const [formData, setFormData] = useState({
    name: 'Shivansh Sharma',
    role: 'AI SaaS Developer',
    company: 'Prodesk IT',
    skills: 'React, Node.js, Vite, Google Gemini API, JavaScript',
    jobDescription: 'Seeking an expert AI SaaS Developer to lead the integration of Generative AI capabilities into custom business intelligence workflows. Must be skilled in React, secure API integrations, and prompt engineering.',
  });

  // PDF upload and text state
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfText, setPdfText] = useState('');
  const [isParsingPdf, setIsParsingPdf] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Generation status and outcomes
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationPhase, setGenerationPhase] = useState('');
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  
  // UI Indicators
  const [isCopied, setIsCopied] = useState(false);
  const [isSimulatedResult, setIsSimulatedResult] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Mode Configuration: Check if API key exists in environment
  const [hasApiKey, setHasApiKey] = useState(false);

  // Verify if Gemini API key exists at runtime
  useEffect(() => {
    const key = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_API_KEY || "";
    setHasApiKey(key.trim().length > 0 && key !== "your_actual_gemini_api_key_here");
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // PDF Drag & Drop logic
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      await processPdfFile(file);
    }
  };

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      await processPdfFile(file);
    }
  };

  const processPdfFile = async (file) => {
    if (file.type !== "application/pdf") {
      setErrorMessage("Unsupported file type! Please upload a PDF resume.");
      return;
    }

    setPdfFile(file);
    setIsParsingPdf(true);
    setErrorMessage('');
    
    try {
      const text = await extractTextFromPdf(file);
      setPdfText(text);
      console.log("PDF parsed successfully. Characters: ", text.length);
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to read PDF text. We will continue using form parameters.");
    } finally {
      setIsParsingPdf(false);
    }
  };

  const handleRemoveFile = () => {
    setPdfFile(null);
    setPdfText('');
    setErrorMessage('');
  };

  // Generate Cover Letter Action
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.role || !formData.company || !formData.skills) {
      setErrorMessage("Please fill in all required parameters.");
      return;
    }

    setIsGenerating(true);
    setErrorMessage('');
    setGeneratedLetter('');

    // Simulate multi-phase API lifecycle progress to improve UX (Phase 2 P1 State Management)
    const phases = [
      "Ingesting state parameters...",
      "Reading uploaded Resume PDF context...",
      "Executing programmatic Prompt Engineering...",
      "Calling Google Gemini AI Flash Engine...",
      "Formatting clean Markdown response..."
    ];

    let currentPhase = 0;
    setGenerationPhase(phases[0]);
    const phaseTimer = setInterval(() => {
      if (currentPhase < phases.length - 1) {
        currentPhase++;
        setGenerationPhase(phases[currentPhase]);
      }
    }, 600);

    try {
      // Automatically route through simulator fallback if API Key is not set up
      const result = await generateCoverLetter({
        name: formData.name,
        role: formData.role,
        company: formData.company,
        skills: formData.skills,
        jobDescription: formData.jobDescription,
        resumeText: pdfText,
        simulate: !hasApiKey // True if no API Key, runs simulator automatically
      });

      setGeneratedLetter(result.text);
      setIsSimulatedResult(result.isSimulated);
      setIsEditing(false);
    } catch (err) {
      setErrorMessage(`Generation Failed: ${err.message}`);
    } finally {
      clearInterval(phaseTimer);
      setIsGenerating(false);
    }
  };

  // Copy to Clipboard Utility
  const handleCopyToClipboard = () => {
    if (!generatedLetter) return;
    navigator.clipboard.writeText(generatedLetter)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Copy failed: ", err);
      });
  };

  // Download TXT Utility
  const handleDownloadTxt = () => {
    if (!generatedLetter) return;
    
    // Clean markdown headings for standard TXT format
    const cleanContent = generatedLetter
      .replace(/#+\s+/g, '') // strip hashes
      .replace(/\*\*+/g, ''); // strip bolding

    const element = document.createElement("a");
    const file = new Blob([cleanContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${formData.name.replace(/\s+/g, '_')}_Cover_Letter_${formData.company.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Custom Inline Markdown Parser (Phase 3 P2 dynamic parsing requirement)
  const parseInlineMarkdown = (text) => {
    if (!text) return '';
    // Regex matches bold tags **text**
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const renderMarkdownToHtml = (markdown) => {
    if (!markdown) return null;
    
    // Standard block splitter
    const blocks = markdown.split(/\n\n+/);
    
    return blocks.map((block, index) => {
      const trimmedBlock = block.trim();
      if (!trimmedBlock) return null;
      
      // Parse main headers
      if (trimmedBlock.startsWith('### ')) {
        return <h3 key={index}>{parseInlineMarkdown(trimmedBlock.replace('### ', ''))}</h3>;
      }
      if (trimmedBlock.startsWith('## ')) {
        return <h2 key={index}>{parseInlineMarkdown(trimmedBlock.replace('## ', ''))}</h2>;
      }
      if (trimmedBlock.startsWith('# ')) {
        return <h1 key={index}>{parseInlineMarkdown(trimmedBlock.replace('# ', ''))}</h1>;
      }
      
      // Parse list items
      if (trimmedBlock.startsWith('* ') || trimmedBlock.startsWith('- ')) {
        const listItems = trimmedBlock.split(/\n[*|-]\s+/).map((item) => item.replace(/^[*|-]\s+/, ''));
        return (
          <ul key={index}>
            {listItems.map((item, i) => (
              <li key={i}>{parseInlineMarkdown(item)}</li>
            ))}
          </ul>
        );
      }

      // Default to HTML paragraphs
      return <p key={index}>{parseInlineMarkdown(trimmedBlock)}</p>;
    });
  };

  return (
    <>
      {/* App Header Bar (AiResume Craft) */}
      <header className="app-header">
        <div className="brand-section">
          <div className="logo-icon">
            <Sparkles size={24} />
          </div>
          <div>
            <h1 className="brand-title">AiResume Craft</h1>
            <div className="brand-subtitle">Engineering Division</div>
          </div>
        </div>
        
        <div className="header-meta">
          <span className="badge badge-primary">
            Sprint 04 // AI Cover Letters
          </span>
          {hasApiKey ? (
            <span className="badge badge-accent">
              Gemini Live Connected
            </span>
          ) : (
            <span className="badge badge-primary" style={{ borderColor: 'rgba(254, 180, 123, 0.4)' }}>
              Simulation Mode
            </span>
          )}
        </div>
      </header>

      {/* Main SaaS Dashboard Layout */}
      <main className="dashboard-grid">
        
        {/* Left Side: Parameters & File uploads */}
        <section className="glass-panel slide-up">
          <div className="panel-header">
            <h2 className="panel-title">
              Candidate & Job Parameters
            </h2>
            <p className="panel-desc">
              Feed your parameters into the AI prompt generator layer.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="parameters-form">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  Candidate Name <span className="required-star">*</span>
                </label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  placeholder="e.g. Shivansh Sharma"
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">
                  Target Job Role <span className="required-star">*</span>
                </label>
                <input 
                  type="text" 
                  name="role" 
                  value={formData.role} 
                  onChange={handleInputChange} 
                  placeholder="e.g. AI Specialist"
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  Target Company <span className="required-star">*</span>
                </label>
                <input 
                  type="text" 
                  name="company" 
                  value={formData.company} 
                  onChange={handleInputChange} 
                  placeholder="e.g. Google"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Key Skills <span className="required-star">*</span>
                </label>
                <input 
                  type="text" 
                  name="skills" 
                  value={formData.skills} 
                  onChange={handleInputChange} 
                  placeholder="React, Node.js, AI integration"
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Job Description Context</label>
              <textarea 
                name="jobDescription" 
                value={formData.jobDescription} 
                onChange={handleInputChange} 
                placeholder="Paste key responsibilities or values here for personalized prompt targeting..."
                className="form-input"
              />
            </div>

            {/* Resume File Parsing Area (Phase 3 P2) */}
            <div className="form-group">
              <label className="form-label">
                Upload Resume PDF (Client-side Extraction)
              </label>
              
              {!pdfFile ? (
                <div 
                  className={`dropzone-container ${dragActive ? 'active' : ''}`}
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('pdf-file-input').click()}
                >
                  <input 
                    type="file" 
                    id="pdf-file-input" 
                    accept="application/pdf"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                  <Upload size={28} className="dropzone-icon" />
                  <p className="dropzone-title">Drag & Drop Resume PDF here or Click to browse</p>
                  <p className="dropzone-subtitle">Text will be extracted dynamically inside browser memory.</p>
                </div>
              ) : (
                <div className="file-status">
                  <div className="file-details">
                    <FileText size={18} />
                    <span>{pdfFile.name} ({(pdfFile.size / 1024).toFixed(1)} KB)</span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {isParsingPdf ? (
                      <span className="badge badge-accent" style={{ animation: 'breathe 1.5s infinite' }}>
                        Parsing PDF...
                      </span>
                    ) : (
                      <span className="badge badge-primary" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#047857', borderColor: 'rgba(16, 185, 129, 0.2)' }}>
                        Text Extracted ({pdfText.length} chars)
                      </span>
                    )}
                    
                    <button 
                      type="button" 
                      onClick={handleRemoveFile} 
                      className="btn-remove-file"
                      title="Remove File"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Info bar if API Key is not set up */}
            {!hasApiKey && (
              <div className="config-section">
                <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(59, 28, 217, 0.04)', border: '1px solid rgba(59, 28, 217, 0.1)', padding: '0.6rem 0.8rem', borderRadius: '8px', fontSize: '0.75rem', color: 'var(--primary)' }}>
                  <Info size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>No live Gemini API key detected in .env. We will automatically execute a personalized <strong>Simulation Mode</strong> incorporating your resume achievements.</span>
                </div>
              </div>
            )}

            {errorMessage && (
              <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(236, 72, 153, 0.08)', border: '1px solid rgba(236, 72, 153, 0.25)', padding: '0.75rem 1rem', borderRadius: '10px', fontSize: '0.8rem', color: '#ec4899', marginTop: '1rem' }}>
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{errorMessage}</span>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isGenerating || isParsingPdf} 
              className="btn-generate"
              style={{ width: '100%' }}
            >
              {isGenerating ? (
                <>
                  <RefreshCw size={18} style={{ animation: 'spin 1.5s infinite linear' }} />
                  <span>Generating Cover Letter...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>Generate Custom Cover Letter</span>
                </>
              )}
            </button>
          </form>
        </section>

        {/* Right Side: Rendered Output Editor Shell */}
        <section className="glass-panel slide-up">
          
          {/* Main loader interface (Phase 2 P1 2-5s Latency UX) */}
          {isGenerating ? (
            <div className="loading-panel">
              <div className="pulse-spinner">
                <div className="spinner-core">
                  <Sparkles size={24} style={{ color: 'var(--primary)' }} />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <h3 className="loading-text">Writing Premium Cover Letter</h3>
                <span className="loading-status-bar">{generationPhase}</span>
              </div>
            </div>
          ) : generatedLetter ? (
            /* Rendered Content Shell */
            <div className="output-shell">
              <div className="output-header-actions">
                <div className="panel-header" style={{ marginBottom: 0 }}>
                  <h2 className="panel-title">
                    Generated Cover Letter
                  </h2>
                  <p className="panel-desc">
                    {isSimulatedResult ? "Data simulation interpolated template" : "Google Gemini AI Custom Output"}
                  </p>
                </div>

                <div className="action-buttons-group">
                  <button 
                    onClick={() => setIsEditing(!isEditing)} 
                    className="action-btn"
                  >
                    {isEditing ? (
                      <>
                        <Eye size={14} />
                        <span>Rendered HTML</span>
                      </>
                    ) : (
                      <>
                        <Edit3 size={14} />
                        <span>Manual Editor</span>
                      </>
                    )}
                  </button>

                  <button 
                    onClick={handleDownloadTxt} 
                    className="action-btn"
                    title="Download Cover Letter as TXT"
                  >
                    <Download size={14} />
                    <span>Download TXT</span>
                  </button>

                  <button 
                    onClick={handleCopyToClipboard} 
                    className="action-btn action-btn-accent"
                  >
                    {isCopied ? (
                      <>
                        <Check size={14} style={{ color: '#10b981' }} />
                        <span style={{ color: '#10b981' }}>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        <span>Copy Clipboard</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Success copy feedback */}
              {isCopied && (
                <div className="success-banner slide-up">
                  <Check size={14} style={{ color: '#047857' }} />
                  <span>Success: Cover letter written to device clipboard. Ready to submit!</span>
                </div>
              )}

              {/* Dynamic Text Editor Area */}
              <div className={`letter-editor-container ${isEditing ? 'editing' : ''}`}>
                {isEditing ? (
                  <textarea 
                    value={generatedLetter} 
                    onChange={(e) => setGeneratedLetter(e.target.value)}
                    className="letter-textarea"
                  />
                ) : (
                  <div className="letter-rich-content">
                    {renderMarkdownToHtml(generatedLetter)}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Empty placeholder status */
            <div className="empty-panel">
              <div className="empty-icon">
                <FileText size={40} />
              </div>
              <h3 className="empty-title">Waiting for Generation</h3>
              <p className="empty-text">
                Populate your engineering parameters on the left and trigger the AI compiler layer to view your tailored cover letter.
              </p>
            </div>
          )}
        </section>
      </main>

      {/* Corporate Shell Footer */}
      <footer className="app-footer">
        <div>
          © 2026 AiResume Craft. All systems operational.
        </div>
        <div className="footer-links">
          <span className="footer-link" style={{ fontSize: '0.75rem' }}>
            AI Engine: Gemini 1.5 Flash
          </span>
          <span style={{ color: 'var(--text-muted)' }}>|</span>
          <span className="footer-link" style={{ fontSize: '0.75rem' }}>
            QA Roster ID: Shivansh Sharma
          </span>
        </div>
      </footer>
    </>
  );
}

export default App;
