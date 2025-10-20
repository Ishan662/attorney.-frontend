import caseDetailsService from './caseDetailsService';
import Swal from 'sweetalert2';

class PrintService {
    // Main print function with confirmation
    static async printCaseDetails(caseData, hearings, timelineEvents, tabToPrint = 'all') {
        const result = await Swal.fire({
            icon: 'question',
            title: 'Print Case Details',
            text: `Are you sure you want to print ${tabToPrint === 'all' ? 'complete' : tabToPrint} case details?`,
            showCancelButton: true,
            confirmButtonColor: '#000000',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Yes, Print',
            cancelButtonText: 'Cancel',
            background: '#ffffff',
            width: '500px',
            customClass: {
                popup: 'rounded-lg'
            }
        });

        if (result.isConfirmed) {
            this.executePrint(caseData, hearings, timelineEvents, tabToPrint);
        }
    }

    // Execute the actual print
    static executePrint(caseData, hearings, timelineEvents, tabToPrint = 'all') {
        const printContent = this.generatePrintHTML(caseData, hearings, timelineEvents, tabToPrint);
        
        const printWindow = window.open('', '_blank', 'width=800,height=600');
        if (!printWindow) {
            Swal.fire({
                icon: 'error',
                title: 'Print Blocked',
                text: 'Please allow pop-ups for this site to enable printing.',
                confirmButtonColor: '#000000'
            });
            return;
        }

        printWindow.document.write(printContent);
        printWindow.document.close();
        
        printWindow.onload = () => {
            setTimeout(() => {
                printWindow.focus();
                printWindow.print();
                
                printWindow.onafterprint = () => {
                    setTimeout(() => printWindow.close(), 500);
                };
                
                setTimeout(() => {
                    if (!printWindow.closed) {
                        printWindow.close();
                    }
                }, 10000);
            }, 500);
        };
    }

    // Generate complete HTML for printing
    static generatePrintHTML(caseData, hearings, timelineEvents, tabToPrint = 'all') {
        const isGeneralOnly = tabToPrint === 'general';
        const isDivorceOnly = tabToPrint === 'divorce';
        const isFullReport = tabToPrint === 'all';

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Case Details - ${caseData.caseNumber}</title>
                ${this.getPrintStyles()}
            </head>
            <body>
                <div class="print-container">
                    ${this.generateHeader(caseData, tabToPrint)}
                    ${(isFullReport || isGeneralOnly) ? this.generateGeneralContent(caseData, hearings, timelineEvents) : ''}
                    ${(isFullReport || isDivorceOnly) ? this.generateDivorceContent(caseData) : ''}
                    ${this.generateFooter()}
                </div>
            </body>
            </html>
        `;
    }

    // Enhanced print styles with professional look
    static getPrintStyles() {
        return `
            <style>
                @page {
                    margin: 0.5in;
                    size: A4;
                }
                
                body {
                    font-family: 'Georgia', 'Times New Roman', serif;
                    font-size: 11pt;
                    line-height: 1.4;
                    color: #1a1a1a;
                    background: white;
                    margin: 0;
                    padding: 0;
                }
                
                .print-container {
                    max-width: none;
                    margin: 0;
                    padding: 20pt;
                }
                
                /* Header Styling */
                .print-header {
                    text-align: center;
                    border: 3px solid #2c3e50;
                    border-radius: 8pt;
                    padding: 25pt;
                    margin-bottom: 30pt;
                    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                    box-shadow: 0 4pt 8pt rgba(0,0,0,0.1);
                }
                
                .print-header h1 {
                    font-size: 22pt;
                    font-weight: bold;
                    margin: 0 0 8pt 0;
                    color: #2c3e50;
                    text-transform: uppercase;
                    letter-spacing: 1pt;
                }
                
                .print-header h2 {
                    font-size: 16pt;
                    margin: 5pt 0;
                    color: #34495e;
                    font-weight: normal;
                }
                
                .print-header .meta-info {
                    font-size: 9pt;
                    color: #6c757d;
                    margin-top: 15pt;
                    font-style: italic;
                }
                
                /* Section Styling */
                .print-section {
                    margin-bottom: 25pt;
                    page-break-inside: avoid;
                    border: 1pt solid #dee2e6;
                    border-radius: 6pt;
                    overflow: hidden;
                }
                
                .print-section-header {
                    background: linear-gradient(135deg, #495057 0%, #6c757d 100%);
                    color: white;
                    padding: 12pt 15pt;
                    font-size: 14pt;
                    font-weight: bold;
                    text-transform: uppercase;
                    letter-spacing: 0.5pt;
                    border-bottom: 2pt solid #495057;
                }
                
                .print-section-content {
                    padding: 15pt;
                    background: #fafafa;
                }
                
                /* Data Row Styling */
                .print-data-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 15pt;
                    margin-bottom: 15pt;
                }
                
                .print-data-item {
                    background: white;
                    padding: 12pt;
                    border: 1pt solid #dee2e6;
                    border-radius: 4pt;
                    box-shadow: 0 1pt 3pt rgba(0,0,0,0.1);
                }
                
                .print-label {
                    font-weight: bold;
                    font-size: 10pt;
                    color: #495057;
                    text-transform: uppercase;
                    letter-spacing: 0.5pt;
                    margin-bottom: 5pt;
                    border-bottom: 1pt solid #e9ecef;
                    padding-bottom: 3pt;
                }
                
                .print-value {
                    font-size: 11pt;
                    color: #212529;
                    font-weight: 500;
                    min-height: 14pt;
                }
                
                /* Status Styling */
                .print-status {
                    background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
                    color: white;
                    padding: 4pt 10pt;
                    border-radius: 12pt;
                    font-size: 9pt;
                    font-weight: bold;
                    text-transform: uppercase;
                    letter-spacing: 0.3pt;
                    display: inline-block;
                    box-shadow: 0 2pt 4pt rgba(0,0,0,0.2);
                }
                
                .print-status.pending {
                    background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%);
                }
                
                .print-status.completed {
                    background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
                }
                
                /* Hearing Styling */
                .print-hearing {
                    background: white;
                    border: 1pt solid #dee2e6;
                    border-radius: 6pt;
                    margin-bottom: 15pt;
                    box-shadow: 0 2pt 4pt rgba(0,0,0,0.1);
                    overflow: hidden;
                }
                
                .print-hearing-header {
                    background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
                    color: white;
                    padding: 10pt 15pt;
                    font-weight: bold;
                    font-size: 12pt;
                }
                
                .print-hearing-content {
                    padding: 15pt;
                }
                
                .print-hearing-row {
                    display: flex;
                    margin-bottom: 8pt;
                    align-items: flex-start;
                }
                
                .print-hearing-label {
                    font-weight: bold;
                    width: 100pt;
                    color: #495057;
                    font-size: 10pt;
                }
                
                .print-hearing-value {
                    flex: 1;
                    color: #212529;
                    font-size: 11pt;
                }
                
                /* Timeline Table */
                .print-timeline {
                    width: 100%;
                    border-collapse: collapse;
                    background: white;
                    border-radius: 6pt;
                    overflow: hidden;
                    box-shadow: 0 2pt 4pt rgba(0,0,0,0.1);
                }
                
                .print-timeline th {
                    background: linear-gradient(135deg, #6f42c1 0%, #5a2d91 100%);
                    color: white;
                    padding: 12pt 10pt;
                    font-size: 11pt;
                    font-weight: bold;
                    text-align: center;
                    text-transform: uppercase;
                    letter-spacing: 0.5pt;
                }
                
                .print-timeline td {
                    padding: 10pt;
                    border-bottom: 1pt solid #e9ecef;
                    text-align: center;
                    font-size: 10pt;
                    background: #fafafa;
                }
                
                .print-timeline tr:nth-child(even) td {
                    background: white;
                }
                
                /* Divorce Details Styling */
                .print-divorce-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 12pt;
                }
                
                .print-document-checklist {
                    background: white;
                    border: 1pt solid #dee2e6;
                    border-radius: 6pt;
                    padding: 15pt;
                    margin-top: 20pt;
                }
                
                .print-document-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 8pt 0;
                    border-bottom: 1pt dotted #dee2e6;
                }
                
                .print-document-name {
                    font-weight: 500;
                    color: #495057;
                }
                
                /* Footer Styling */
                .print-footer {
                    margin-top: 40pt;
                    padding-top: 20pt;
                    border-top: 2pt solid #dee2e6;
                }
                
                .print-confidential {
                    background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
                    color: white;
                    padding: 15pt;
                    text-align: center;
                    font-weight: bold;
                    font-size: 12pt;
                    border-radius: 6pt;
                    margin-bottom: 25pt;
                    box-shadow: 0 3pt 6pt rgba(220,53,69,0.3);
                    text-transform: uppercase;
                    letter-spacing: 1pt;
                }
                
                .print-signatures {
                    display: flex;
                    justify-content: space-between;
                    margin: 30pt 0;
                }
                
                .print-signature-box {
                    text-align: center;
                    width: 200pt;
                }
                
                .print-signature-line {
                    border-top: 2pt solid #495057;
                    margin-bottom: 8pt;
                }
                
                .print-signature-label {
                    font-size: 10pt;
                    color: #6c757d;
                    font-weight: bold;
                    text-transform: uppercase;
                }
                
                .print-meta-footer {
                    text-align: center;
                    font-size: 8pt;
                    color: #6c757d;
                    margin-top: 25pt;
                    padding-top: 15pt;
                    border-top: 1pt solid #dee2e6;
                }
                
                /* Page break controls */
                .page-break-before {
                    page-break-before: always;
                }
                
                .page-break-after {
                    page-break-after: always;
                }
                
                .avoid-page-break {
                    page-break-inside: avoid;
                }
                
                /* Responsive adjustments for print */
                @media print {
                    .print-data-grid {
                        grid-template-columns: 1fr 1fr;
                    }
                    
                    .print-divorce-grid {
                        grid-template-columns: 1fr 1fr;
                    }
                    
                    * {
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                }
            </style>
        `;
    }

    // Generate header section
    static generateHeader(caseData, tabToPrint) {
        const isGeneralOnly = tabToPrint === 'general';
        const isDivorceOnly = tabToPrint === 'divorce';
        
        const title = isGeneralOnly ? 'GENERAL CASE DETAILS' : 
                     isDivorceOnly ? 'DIVORCE CASE DETAILS' : 
                     'COMPREHENSIVE CASE REPORT';

        return `
            <div class="print-header">
                <h1>${title}</h1>
                <h2>Case No: ${caseData.caseNumber}</h2>
                <div class="meta-info">
                    Generated on ${new Date().toLocaleDateString('en-US', { 
                        weekday: 'long',
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric'
                    })} at ${new Date().toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                    })}
                </div>
            </div>
        `;
    }

    // Generate general content sections
    static generateGeneralContent(caseData, hearings, timelineEvents) {
        return `
            ${this.generateCaseOverview(caseData)}
            ${this.generatePartiesInvolved(caseData)}
            ${this.generateFinancialInfo(caseData)}
            ${hearings && hearings.length > 0 ? this.generateHearings(hearings) : ''}
            ${timelineEvents && timelineEvents.length > 0 ? this.generateTimeline(timelineEvents) : ''}
        `;
    }

    // Generate case overview section
    static generateCaseOverview(caseData) {
        return `
            <div class="print-section avoid-page-break">
                <div class="print-section-header">Case Overview</div>
                <div class="print-section-content">
                    <div class="print-data-grid">
                        <div class="print-data-item">
                            <div class="print-label">Case Name</div>
                            <div class="print-value">${caseData.caseTitle || 'N/A'}</div>
                        </div>
                        <div class="print-data-item">
                            <div class="print-label">Case Type</div>
                            <div class="print-value">${caseData.caseType || 'N/A'}</div>
                        </div>
                        <div class="print-data-item">
                            <div class="print-label">Court Type</div>
                            <div class="print-value">${caseData.courtType || 'N/A'}</div>
                        </div>
                        <div class="print-data-item">
                            <div class="print-label">Court Name</div>
                            <div class="print-value">${caseData.courtName || 'N/A'}</div>
                        </div>
                        <div class="print-data-item">
                            <div class="print-label">Case Status</div>
                            <div class="print-value">
                                <span class="print-status ${(caseData.status || '').toLowerCase()}">${caseData.status || 'N/A'}</span>
                            </div>
                        </div>
                        <div class="print-data-item">
                            <div class="print-label">Case Number</div>
                            <div class="print-value">${caseData.caseNumber || 'N/A'}</div>
                        </div>
                    </div>
                    ${caseData.description ? `
                    <div class="print-data-item" style="grid-column: 1 / -1;">
                        <div class="print-label">Case Description</div>
                        <div class="print-value">${caseData.description}</div>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    // Generate parties involved section
    static generatePartiesInvolved(caseData) {
        return `
            <div class="print-section avoid-page-break">
                <div class="print-section-header">Parties Involved</div>
                <div class="print-section-content">
                    <div class="print-data-grid">
                        <div class="print-data-item">
                            <div class="print-label">Client Name</div>
                            <div class="print-value">${caseData.clientName || 'Not assigned'}</div>
                        </div>
                        <div class="print-data-item">
                            <div class="print-label">Client Phone</div>
                            <div class="print-value">${caseData.clientPhone || 'N/A'}</div>
                        </div>
                        <div class="print-data-item">
                            <div class="print-label">Client Email</div>
                            <div class="print-value">${caseData.clientEmail || 'N/A'}</div>
                        </div>
                        <div class="print-data-item">
                            <div class="print-label">Opposing Party</div>
                            <div class="print-value">${caseData.opposingPartyName || 'N/A'}</div>
                        </div>
                        <div class="print-data-item">
                            <div class="print-label">Junior Lawyer</div>
                            <div class="print-value">${caseData.junior || 'Not Assigned'}</div>
                        </div>
                        <div class="print-data-item">
                            <div class="print-label">Case Created</div>
                            <div class="print-value">${caseData.createdAt ? new Date(caseData.createdAt).toLocaleDateString() : 'N/A'}</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Generate financial information section
    static generateFinancialInfo(caseData) {
        return `
            <div class="print-section avoid-page-break">
                <div class="print-section-header">Financial Information</div>
                <div class="print-section-content">
                    <div class="print-data-grid">
                        <div class="print-data-item">
                            <div class="print-label">Agreed Fee</div>
                            <div class="print-value">$${caseData.agreedFee ? caseData.agreedFee.toFixed(2) : '0.00'}</div>
                        </div>
                        <div class="print-data-item">
                            <div class="print-label">Payment Status</div>
                            <div class="print-value">
                                <span class="print-status ${(caseData.paymentStatus || '').toLowerCase().replace('_', '-')}">${caseData.paymentStatus ? caseData.paymentStatus.replace('_', ' ') : 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Generate hearings section
    static generateHearings(hearings) {
        if (!hearings || hearings.length === 0) return '';

        const hearingsHtml = hearings.map(hearing => `
            <div class="print-hearing avoid-page-break">
                <div class="print-hearing-header">${hearing.title || 'Hearing'}</div>
                <div class="print-hearing-content">
                    <div class="print-hearing-row">
                        <div class="print-hearing-label">Date & Time:</div>
                        <div class="print-hearing-value">${new Date(hearing.hearingDate).toLocaleString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric', 
                            hour: 'numeric', 
                            minute: '2-digit', 
                            hour12: true 
                        })}</div>
                    </div>
                    ${hearing.location ? `
                    <div class="print-hearing-row">
                        <div class="print-hearing-label">Location:</div>
                        <div class="print-hearing-value">${hearing.location}</div>
                    </div>
                    ` : ''}
                    ${hearing.note ? `
                    <div class="print-hearing-row">
                        <div class="print-hearing-label">Notes:</div>
                        <div class="print-hearing-value">${hearing.note}</div>
                    </div>
                    ` : ''}
                    <div class="print-hearing-row">
                        <div class="print-hearing-label">Status:</div>
                        <div class="print-hearing-value">
                            <span class="print-status ${(hearing.status || '').toLowerCase()}">${hearing.status || 'Scheduled'}</span>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        return `
            <div class="print-section">
                <div class="print-section-header">Hearings & Key Dates</div>
                <div class="print-section-content">
                    ${hearingsHtml}
                </div>
            </div>
        `;
    }

    // Generate timeline section
    static generateTimeline(timelineEvents) {
        if (!timelineEvents || timelineEvents.length === 0) return '';

        const timelineRows = timelineEvents.map((event, idx) => `
            <tr>
                <td>${idx + 1}</td>
                <td>${event.date}</td>
                <td>${event.label}</td>
            </tr>
        `).join('');

        return `
            <div class="print-section avoid-page-break">
                <div class="print-section-header">Case Progress Timeline</div>
                <div class="print-section-content">
                    <table class="print-timeline">
                        <thead>
                            <tr>
                                <th>Step</th>
                                <th>Date</th>
                                <th>Event</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${timelineRows}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    // Generate divorce-specific content
    static generateDivorceContent(caseData) {
        if (!caseDetailsService.isDivorceCase(caseData.caseType) || !caseData.additionalDetails) {
            return '';
        }

        const details = caseData.additionalDetails;
        
        return `
            <div class="print-section page-break-before">
                <div class="print-section-header">Divorce Case Specific Details</div>
                <div class="print-section-content">
                    <div class="print-divorce-grid">
                        ${details.marriageDate ? `
                        <div class="print-data-item">
                            <div class="print-label">Marriage Date</div>
                            <div class="print-value">${new Date(details.marriageDate).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                            })}</div>
                        </div>
                        ` : ''}
                        ${details.separationDate ? `
                        <div class="print-data-item">
                            <div class="print-label">Separation Date</div>
                            <div class="print-value">${new Date(details.separationDate).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                            })}</div>
                        </div>
                        ` : ''}
                        ${details.groundsForDivorce ? `
                        <div class="print-data-item">
                            <div class="print-label">Grounds for Divorce</div>
                            <div class="print-value">${details.groundsForDivorce}</div>
                        </div>
                        ` : ''}
                        ${details.childrenInvolved !== undefined ? `
                        <div class="print-data-item">
                            <div class="print-label">Children Involved</div>
                            <div class="print-value">
                                <span class="print-status ${details.childrenInvolved ? 'completed' : 'pending'}">${details.childrenInvolved ? 'Yes' : 'No'}</span>
                            </div>
                        </div>
                        ` : ''}
                        ${details.custodyArrangements ? `
                        <div class="print-data-item" style="grid-column: 1 / -1;">
                            <div class="print-label">Custody Arrangements</div>
                            <div class="print-value">${details.custodyArrangements}</div>
                        </div>
                        ` : ''}
                        ${details.alimonyRequested !== undefined ? `
                        <div class="print-data-item">
                            <div class="print-label">Alimony Requested</div>
                            <div class="print-value">
                                <span class="print-status ${details.alimonyRequested ? 'completed' : 'pending'}">${details.alimonyRequested ? 'Yes' : 'No'}</span>
                            </div>
                        </div>
                        ` : ''}
                        ${details.propertyDivision ? `
                        <div class="print-data-item" style="grid-column: 1 / -1;">
                            <div class="print-label">Property Division Details</div>
                            <div class="print-value">${details.propertyDivision}</div>
                        </div>
                        ` : ''}
                    </div>
                    
                    ${details.documentChecklist && details.documentChecklist.length > 0 ? `
                    <div class="print-document-checklist">
                        <div class="print-label" style="margin-bottom: 15pt; font-size: 12pt; text-align: center;">Document Submission Checklist</div>
                        ${details.documentChecklist.map(doc => `
                            <div class="print-document-item">
                                <div class="print-document-name">${doc.name}</div>
                                <div>
                                    <span class="print-status ${(doc.status || 'pending').toLowerCase()}">${doc.status || 'Pending'}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    // Generate footer section
    static generateFooter() {
        return `
            <div class="print-footer">
                <div class="print-confidential">
                    ⚠️ CONFIDENTIAL LEGAL DOCUMENT ⚠️<br/>
                    This document contains privileged attorney-client information and is strictly confidential.
                </div>
                
                <div class="print-signatures">
                    <div class="print-signature-box">
                        <div class="print-signature-line"></div>
                        <div class="print-signature-label">Attorney Signature</div>
                        <div style="margin-top: 8pt; font-size: 9pt; color: #6c757d;">Date: _______________</div>
                    </div>
                    <div class="print-signature-box">
                        <div class="print-signature-line"></div>
                        <div class="print-signature-label">Client Signature</div>
                        <div style="margin-top: 8pt; font-size: 9pt; color: #6c757d;">Date: _______________</div>
                    </div>
                </div>
                
                <div class="print-meta-footer">
                    <p><strong>Attorney Management System</strong> | Generated: ${new Date().toLocaleString('en-US')}</p>
                    <p>© ${new Date().getFullYear()} Law Firm Management Solutions | Document ID: ${Date.now()}</p>
                    <p style="margin-top: 8pt; font-style: italic;">This document is electronically generated and legally binding when signed.</p>
                </div>
            </div>
        `;
    }
}

export default PrintService;
