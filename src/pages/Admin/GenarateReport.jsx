import React, { useState } from 'react';
// import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
// import { saveAs } from 'file-saver';
import { format } from 'date-fns';
import Button1 from '../../components/UI/Button1';
import Button2 from '../../components/UI/Button2';

const ReportGenerator = ({ isOpen, onClose, analyticsData, chartType, timeRange }) => {
  const [reportType, setReportType] = useState('detailed');
  const [includeSections, setIncludeSections] = useState({
    userStats: true,
    caseStats: true,
    revenueStats: true,
    regionalData: true,
    performanceData: true,
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [dateRange, setDateRange] = useState({
    from: format(new Date(new Date().setMonth(new Date().getMonth() - 1)), 'yyyy-MM-dd'),
    to: format(new Date(), 'yyyy-MM-dd')
  });

  const handleSectionToggle = (section) => {
    setIncludeSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const generatePdfReport = async () => {
    setIsGenerating(true);
    
    try {
      // Create a new PDF document
      const pdfDoc = await PDFDocument.create();
      const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
      const boldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
      
      // Add a page
      const page = pdfDoc.addPage();
      const { width, height } = page.getSize();
      const fontSize = 12;
      
      // Add company logo/header
      page.drawText("Attorney Management System", {
        x: 50,
        y: height - 50,
        size: 24,
        font: boldFont,
        color: rgb(0, 0.3, 0.6)
      });
      
      // Add title
      page.drawText("Analytics Report", {
        x: 50,
        y: height - 80,
        size: 18,
        font: boldFont
      });
      
      // Add date
      page.drawText(`Generated on: ${format(new Date(), 'MMMM d, yyyy')}`, {
        x: 50,
        y: height - 100,
        size: fontSize,
        font: timesRomanFont
      });
      
      // Add date range
      page.drawText(`Period: ${format(new Date(dateRange.from), 'MMMM d, yyyy')} to ${format(new Date(dateRange.to), 'MMMM d, yyyy')}`, {
        x: 50,
        y: height - 120,
        size: fontSize,
        font: timesRomanFont
      });
      
      let currentY = height - 160;
      
      // Add section headings and data based on selections
      if (includeSections.userStats) {
        page.drawText("User Statistics", {
          x: 50,
          y: currentY,
          size: 16,
          font: boldFont
        });
        
        currentY -= 25;
        
        const userStats = [
          `Total Users: ${analyticsData.userStats.totalUsers}`,
          `Active Users: ${analyticsData.userStats.activeUsers}`,
          `Inactive Users: ${analyticsData.userStats.inactiveUsers}`,
          `Growth Rate: ${analyticsData.userStats.growthRate}`,
          `New Users This Month: ${analyticsData.userStats.newUsersThisMonth}`
        ];
        
        userStats.forEach(stat => {
          page.drawText(stat, {
            x: 70,
            y: currentY,
            size: fontSize,
            font: timesRomanFont
          });
          currentY -= 20;
        });
        
        currentY -= 15;
      }
      
      if (includeSections.caseStats) {
        page.drawText("Case Statistics", {
          x: 50,
          y: currentY,
          size: 16,
          font: boldFont
        });
        
        currentY -= 25;
        
        const caseStats = [
          `Total Cases: ${analyticsData.caseStats.totalCases}`,
          `Active Cases: ${analyticsData.caseStats.activeCases}`,
          `Closed Cases: ${analyticsData.caseStats.closedCases}`,
          `Win Rate: ${analyticsData.caseStats.winRate}`,
          `New Cases This Month: ${analyticsData.caseStats.newCasesThisMonth}`
        ];
        
        caseStats.forEach(stat => {
          page.drawText(stat, {
            x: 70,
            y: currentY,
            size: fontSize,
            font: timesRomanFont
          });
          currentY -= 20;
        });
        
        currentY -= 15;
      }
      
      if (includeSections.revenueStats) {
        page.drawText("Revenue Statistics", {
          x: 50,
          y: currentY,
          size: 16,
          font: boldFont
        });
        
        currentY -= 25;
        
        const revenueStats = [
          `Total Revenue: ${analyticsData.revenueStats.totalRevenue}`,
          `Current Month Revenue: ${analyticsData.revenueStats.currentMonthRevenue}`,
          `Revenue Growth: ${analyticsData.revenueStats.revenueGrowth}`,
          `Pending Payments: ${analyticsData.revenueStats.pendingPayments}`,
          `Average Case Value: ${analyticsData.revenueStats.averageCaseValue}`
        ];
        
        revenueStats.forEach(stat => {
          page.drawText(stat, {
            x: 70,
            y: currentY,
            size: fontSize,
            font: timesRomanFont
          });
          currentY -= 20;
        });
        
        currentY -= 15;
      }

      // If we need to add a new page due to content length
      if (currentY < 100) {
        const newPage = pdfDoc.addPage();
        currentY = newPage.getSize().height - 50;
      }
      
      // Add executive summary
      page.drawText("Executive Summary", {
        x: 50,
        y: currentY,
        size: 16,
        font: boldFont
      });
      
      currentY -= 25;
      
      let summary = "";
      
      switch(chartType) {
        case 'users':
          summary = `The system currently has ${analyticsData.userStats.totalUsers} total users with an active rate of ${((analyticsData.userStats.activeUsers / analyticsData.userStats.totalUsers) * 100).toFixed(1)}%. User growth is trending ${analyticsData.userStats.growthRate.includes('+') ? 'positively' : 'negatively'} at ${analyticsData.userStats.growthRate}.`;
          break;
        case 'cases':
          summary = `There are currently ${analyticsData.caseStats.activeCases} active cases in the system with a total of ${analyticsData.caseStats.totalCases} cases recorded. The current win rate stands at ${analyticsData.caseStats.winRate}.`;
          break;
        case 'revenue':
          summary = `Total revenue generated is ${analyticsData.revenueStats.totalRevenue} with ${analyticsData.revenueStats.currentMonthRevenue} from the current month. Growth is trending at ${analyticsData.revenueStats.revenueGrowth} with pending payments of ${analyticsData.revenueStats.pendingPayments}.`;
          break;
        default:
          summary = `The system is performing well with ${analyticsData.userStats.totalUsers} users, ${analyticsData.caseStats.totalCases} cases, and ${analyticsData.revenueStats.totalRevenue} in total revenue.`;
      }
      
      const lines = splitTextToLines(summary, 65);
      lines.forEach(line => {
        page.drawText(line, {
          x: 70,
          y: currentY,
          size: fontSize,
          font: timesRomanFont
        });
        currentY -= 20;
      });
      
      // Add footer
      page.drawText("Confidential - Attorney Management System", {
        x: width / 2 - 100,
        y: 40,
        size: 10,
        font: timesRomanFont
      });
      
      page.drawText(`Page 1 of ${pdfDoc.getPageCount()}`, {
        x: width - 100,
        y: 40,
        size: 10,
        font: timesRomanFont
      });
      
      // Save the PDF
      const pdfBytes = await pdfDoc.save();
      
      // Download the PDF
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      saveAs(blob, `analytics-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
      
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate report. Please try again.");
    } finally {
      setIsGenerating(false);
      onClose();
    }
  };

  // Helper function to split text into lines
  function splitTextToLines(text, maxCharsPerLine) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
    
    words.forEach(word => {
      if ((currentLine + word).length > maxCharsPerLine) {
        lines.push(currentLine.trim());
        currentLine = word + ' ';
      } else {
        currentLine += word + ' ';
      }
    });
    
    if (currentLine.trim().length > 0) {
      lines.push(currentLine.trim());
    }
    
    return lines;
  }

  const generateCsvReport = () => {
    setIsGenerating(true);
    
    try {
      let csvContent = "data:text/csv;charset=utf-8,";
      
      // Add header row
      csvContent += "Category,Metric,Value\n";
      
      // Add user stats
      if (includeSections.userStats) {
        csvContent += "User Stats,Total Users," + analyticsData.userStats.totalUsers + "\n";
        csvContent += "User Stats,Active Users," + analyticsData.userStats.activeUsers + "\n";
        csvContent += "User Stats,Inactive Users," + analyticsData.userStats.inactiveUsers + "\n";
        csvContent += "User Stats,Growth Rate," + analyticsData.userStats.growthRate + "\n";
        csvContent += "User Stats,New Users This Month," + analyticsData.userStats.newUsersThisMonth + "\n";
      }
      
      // Add case stats
      if (includeSections.caseStats) {
        csvContent += "Case Stats,Total Cases," + analyticsData.caseStats.totalCases + "\n";
        csvContent += "Case Stats,Active Cases," + analyticsData.caseStats.activeCases + "\n";
        csvContent += "Case Stats,Closed Cases," + analyticsData.caseStats.closedCases + "\n";
        csvContent += "Case Stats,Win Rate," + analyticsData.caseStats.winRate + "\n";
        csvContent += "Case Stats,New Cases This Month," + analyticsData.caseStats.newCasesThisMonth + "\n";
      }
      
      // Add revenue stats
      if (includeSections.revenueStats) {
        csvContent += "Revenue Stats,Total Revenue," + analyticsData.revenueStats.totalRevenue.replace('$', '') + "\n";
        csvContent += "Revenue Stats,Current Month Revenue," + analyticsData.revenueStats.currentMonthRevenue.replace('$', '') + "\n";
        csvContent += "Revenue Stats,Revenue Growth," + analyticsData.revenueStats.revenueGrowth + "\n";
        csvContent += "Revenue Stats,Pending Payments," + analyticsData.revenueStats.pendingPayments.replace('$', '') + "\n";
        csvContent += "Revenue Stats,Average Case Value," + analyticsData.revenueStats.averageCaseValue.replace('$', '') + "\n";
      }
      
      // Create a download link and trigger download
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `analytics-report-${format(new Date(), 'yyyy-MM-dd')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error("Error generating CSV:", error);
      alert("Failed to generate report. Please try again.");
    } finally {
      setIsGenerating(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-xl font-bold">Generate Analytics Report</h2>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio h-4 w-4 text-blue-600"
                  name="reportType"
                  value="detailed"
                  checked={reportType === 'detailed'}
                  onChange={() => setReportType('detailed')}
                />
                <span className="ml-2">Detailed Report</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio h-4 w-4 text-blue-600"
                  name="reportType"
                  value="summary"
                  checked={reportType === 'summary'}
                  onChange={() => setReportType('summary')}
                />
                <span className="ml-2">Summary Report</span>
              </label>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">From</label>
                <input
                  type="date"
                  value={dateRange.from}
                  onChange={(e) => setDateRange({...dateRange, from: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">To</label>
                <input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) => setDateRange({...dateRange, to: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Include in Report</label>
            <div className="space-y-2">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={includeSections.userStats}
                  onChange={() => handleSectionToggle('userStats')}
                  className="form-checkbox h-4 w-4 text-blue-600"
                />
                <span className="ml-2">User Statistics</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={includeSections.caseStats}
                  onChange={() => handleSectionToggle('caseStats')}
                  className="form-checkbox h-4 w-4 text-blue-600"
                />
                <span className="ml-2">Case Statistics</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={includeSections.revenueStats}
                  onChange={() => handleSectionToggle('revenueStats')}
                  className="form-checkbox h-4 w-4 text-blue-600"
                />
                <span className="ml-2">Revenue Statistics</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={includeSections.regionalData}
                  onChange={() => handleSectionToggle('regionalData')}
                  className="form-checkbox h-4 w-4 text-blue-600"
                />
                <span className="ml-2">Regional Data</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={includeSections.performanceData}
                  onChange={() => handleSectionToggle('performanceData')}
                  className="form-checkbox h-4 w-4 text-blue-600"
                />
                <span className="ml-2">Lawyer Performance Data</span>
              </label>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <div className="flex flex-col space-y-2 mb-2">
              <p className="text-sm font-medium text-gray-700">Export Format</p>
              <div className="flex space-x-2">
                <Button1
                  text={isGenerating ? "Generating PDF..." : "Generate PDF Report"}
                  onClick={generatePdfReport}
                  disabled={isGenerating}
                  className="flex-1 py-2"
                />
                <Button1
                  text={isGenerating ? "Generating CSV..." : "Generate CSV Report"}
                  onClick={generateCsvReport}
                  disabled={isGenerating}
                  className="flex-1 py-2"
                />
              </div>
            </div>
            <Button2
              text="Cancel"
              onClick={onClose}
              disabled={isGenerating}
              className="w-full py-2 mt-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportGenerator;