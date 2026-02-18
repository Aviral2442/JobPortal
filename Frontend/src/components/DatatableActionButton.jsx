import axios from "axios";
import React, { useState } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

(pdfMake).vfs = pdfFonts;


const DatatableActionButton = ({ endpoint, dataAccess }) => {
  const baseURL = import.meta.env.VITE_BASE_URL || "";
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch full export data
  const fetchActionData = async () => {
    try {
      console.log(`Fetching data for export from ${baseURL}api${endpoint}`);
      setLoading(true);
      const res = await axios.get(`${baseURL}/api${endpoint}`, {
        params: {
          page: 1,
          limit: 100,
        },
      });
      console.log('Data table data', res.data?.jsonData?.[dataAccess]);

      return res.data?.jsonData?.[dataAccess] || [];
    } catch (error) {
      console.error("Export error:", error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // 🔹 COPY
  const handleCopy = async () => {
    const data = await fetchActionData();
    if (!data.length) return;

    const headers = Object.keys(data[0]);
    const rows = data.map((row) =>
      headers.map((h) => row[h]).join("\t")
    );

    const text = [headers.join("\t"), ...rows].join("\n");
    await navigator.clipboard.writeText(text);
  };

  // 🔹 CSV
  const handleCSV = async () => {
    const data = await fetchActionData();
    if (!data.length) return;

    const headers = Object.keys(data[0]);

    const escapeCSV = (value) => {
      if (value == null) return "";
      const str = String(value);
      return `"${str.replace(/"/g, '""')}"`;
    };

    const rows = data.map((row) =>
      headers.map((h) => escapeCSV(row[h])).join(",")
    );

    const csvContent = [headers.join(","), ...rows].join("\n");
    downloadFile(csvContent, "export.csv", "text/csv;charset=utf-8;");
  };

  // 🔹 EXCEL
  const handleExcel = async () => {
    const data = await fetchActionData();
    if (!data.length) return;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Data");

    worksheet.columns = Object.keys(data[0]).map((key) => ({
      header: key,
      key,
    }));

    worksheet.addRows(data);

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "export.xlsx");
  };


  // 🔹 PDF
  const handlePDF = async () => {
    const data = await fetchActionData();
    if (!data.length) return;

    const headers = Object.keys(data[0]);
    const body = [
      headers.map((h) => ({ text: h, bold: true })),
      ...data.map((row) => headers.map((h) => row[h] ?? "")),
    ];

    pdfMake.createPdf({
      pageOrientation: "landscape",
      content: [
        { text: "Exported Data", style: "header" },
        {
          table: {
            headerRows: 1,
            body,
          },
          layout: "lightHorizontalLines",
        },
      ],
      styles: {
        header: {
          fontSize: 16,
          bold: true,
          marginBottom: 10,
        },
      },
    }).download("export.pdf");
  };

  // 🔹 Download helpers
  const downloadFile = (
    content,
    filename,
    type
  ) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="dt-buttons btn-group flex-wrap">
      <button
        className="btn btn-secondary buttons-copy buttons-html5 btn-sm btn-primary"
        disabled={loading}
        onClick={handleCopy}
      >
        Copy
      </button>

      <button
        className="btn btn-secondary buttons-excel buttons-html5 btn-sm btn-primary"
        disabled={loading}
        onClick={handleExcel}
      >
        Excel
      </button>

      <button
        className="btn btn-secondary buttons-csv buttons-html5 btn-sm btn-primary"
        disabled={loading}
        onClick={handleCSV}
      >
        CSV
      </button>

      <button
        className="btn btn-secondary buttons-pdf buttons-html5 btn-sm btn-primary"
        disabled={loading}
        onClick={handlePDF}
      >
        PDF
      </button>
    </div>
  );
};

export default DatatableActionButton;
