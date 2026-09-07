/* ═════════════════════════════════════════════════════════════════════
   Generic Data Export/Import Utilities (CSV, Excel)
   ═════════════════════════════════════════════════════════════════════ */

import * as XLSX from 'xlsx';

/* ── Helpers ── */

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function formatDate(): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());
}

/**
 * Safely get a string value from an object property, handling nested keys
 * like "ownerName" or "companyName".
 */
function getNestedValue(
  obj: Record<string, unknown>,
  key: string,
): string {
  const value = obj[key];
  if (value === null || value === undefined) return '';
  if (typeof value === 'object' && 'label' in (value as Record<string, unknown>)) {
    return String((value as Record<string, unknown>).label ?? '');
  }
  return String(value);
}

/* ═════════════════════════════════════════════════════════════════════
   Types
   ═════════════════════════════════════════════════════════════════════ */

export interface ExportColumn<T> {
  key: keyof T;
  label: string;
  /** Optional formatter function */
  format?: (value: unknown, item: T) => string;
}

export type ImportResult<T> = {
  success: boolean;
  data: Partial<T>[];
  errors: { row: number; message: string }[];
};

/* ═════════════════════════════════════════════════════════════════════
   CSV Export
   ═════════════════════════════════════════════════════════════════════ */

export function exportToCSV<T>(
  data: T[],
  filename: string,
  columns: ExportColumn<T>[],
): void {
  if (data.length === 0) return;

  const rows: string[][] = [];

  // Header
  rows.push(columns.map((col) => col.label));

  // Data rows
  data.forEach((item) => {
    const record = item as unknown as Record<string, unknown>;
    rows.push(
      columns.map((col) => {
        const value = col.format
          ? col.format(record[col.key as string], item)
          : getNestedValue(record, col.key as string);
        return value;
      }),
    );
  });

  const csvContent = rows
    .map((row) =>
      row
        .map((cell) => {
          if (
            cell.includes(',') ||
            cell.includes('"') ||
            cell.includes('\n')
          ) {
            return `"${cell.replace(/"/g, '""')}"`;
          }
          return cell;
        })
        .join(','),
    )
    .join('\n');

  // Add BOM for Excel compatibility with French characters
  const bom = '\uFEFF';
  const csvBlob = new Blob([bom + csvContent], {
    type: 'text/csv;charset=utf-8;',
  });
  downloadBlob(csvBlob, `${filename}-${Date.now()}.csv`);
}

/* ═════════════════════════════════════════════════════════════════════
   Excel Export
   ═════════════════════════════════════════════════════════════════════ */

export function exportToExcel<T>(
  data: T[],
  filename: string,
  columns: ExportColumn<T>[],
): void {
  if (data.length === 0) return;

  const wb = XLSX.utils.book_new();

  const sheetData: (string | number | boolean)[][] = [
    columns.map((col) => col.label),
    ...data.map((item) => {
      const record = item as unknown as Record<string, unknown>;
      return columns.map((col) => {
        const val = col.format
          ? col.format(record[col.key as string], item)
          : getNestedValue(record, col.key as string);
        const num = Number(val);
        return !isNaN(num) && val !== '' ? num : val;
      });
    }),
  ];

  const sheet = XLSX.utils.aoa_to_sheet(sheetData);

  // Auto-fit column widths
  const colWidths = columns.map((col) => {
    const maxLabelLen = col.label.length;
    const maxDataLen = data.reduce((max, item) => {
      const record = item as unknown as Record<string, unknown>;
      const val = col.format
        ? col.format(record[col.key as string], item)
        : getNestedValue(record, col.key as string);
      return Math.max(max, String(val).length);
    }, 0);
    return { wch: Math.max(maxLabelLen, maxDataLen, 10) + 2 };
  });
  sheet['!cols'] = colWidths;

  XLSX.utils.book_append_sheet(wb, sheet, 'Données');

  // Add metadata sheet
  const metaData = [
    ['LeadPro CRM — Export'],
    [`Généré le ${formatDate()}`],
    [`Nombre d'enregistrements`, data.length],
  ];
  const metaSheet = XLSX.utils.aoa_to_sheet(metaData);
  XLSX.utils.book_append_sheet(wb, metaSheet, 'Info');

  const excelBuffer = XLSX.write(wb, {
    bookType: 'xlsx',
    type: 'array',
  });
  const excelBlob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  downloadBlob(excelBlob, `${filename}-${Date.now()}.xlsx`);
}

/* ═════════════════════════════════════════════════════════════════════
   CSV Import
   ═════════════════════════════════════════════════════════════════════ */

export function importFromCSV<T>(
  file: File,
  columnMapping: Record<string, keyof T>,
): Promise<ImportResult<T>> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split('\n').filter((line) => line.trim() !== '');

        if (lines.length < 2) {
          resolve({
            success: false,
            data: [],
            errors: [{ row: 0, message: 'Le fichier ne contient pas assez de données.' }],
          });
          return;
        }

        // Parse header row
        const headers = parseCSVLine(lines[0]!);
        const errors: { row: number; message: string }[] = [];
        const data: Partial<T>[] = [];

        for (let i = 1; i < lines.length; i++) {
          const values = parseCSVLine(lines[i]!);
          const item: Record<string, unknown> = {};

          headers.forEach((header, idx) => {
            const mappedKey = columnMapping[header.trim()];
            if (mappedKey && values[idx] !== undefined) {
              item[mappedKey as string] = values[idx]?.trim() ?? '';
            }
          });

          if (Object.keys(item).length > 0) {
            data.push(item as Partial<T>);
          } else {
            errors.push({
              row: i + 1,
              message: 'Ligne ignorée : aucune colonne reconnue.',
            });
          }
        }

        resolve({
          success: errors.length === 0,
          data,
          errors,
        });
      } catch (err) {
        reject(new Error('Erreur lors de la lecture du fichier CSV.'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Erreur lors de la lecture du fichier.'));
    };

    reader.readAsText(file);
  });
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i]!;

    if (char === '"') {
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());

  return result;
}

/* ═════════════════════════════════════════════════════════════════════
   Excel Import
   ═════════════════════════════════════════════════════════════════════ */

export function importFromExcel<T>(
  file: File,
  columnMapping: Record<string, keyof T>,
): Promise<ImportResult<T>> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const data = event.target?.result as ArrayBuffer;
        const workbook = XLSX.read(data, { type: 'array' });

        // Use the first sheet (skip the Info sheet)
        const firstSheetName = workbook.SheetNames.find(
          (name) => name !== 'Info',
        ) ?? workbook.SheetNames[0];

        if (!firstSheetName) {
          resolve({
            success: false,
            data: [],
            errors: [{ row: 0, message: 'Aucune feuille trouvée.' }],
          });
          return;
        }

        const sheet = workbook.Sheets[firstSheetName]!;
        const jsonData = XLSX.utils.sheet_to_json<Record<string, unknown>>(
          sheet,
          { defval: '' },
        );

        if (jsonData.length === 0) {
          resolve({
            success: false,
            data: [],
            errors: [{ row: 0, message: 'Aucune donnée trouvée.' }],
          });
          return;
        }

        const errors: { row: number; message: string }[] = [];
        const mappedData: Partial<T>[] = [];

        jsonData.forEach((row, idx) => {
          const item: Record<string, unknown> = {};
          let hasData = false;

          Object.entries(columnMapping).forEach(([header, key]) => {
            const value = row[header];
            if (value !== undefined && value !== null && value !== '') {
              item[key as string] = value;
              hasData = true;
            }
          });

          if (hasData) {
            mappedData.push(item as Partial<T>);
          } else {
            errors.push({
              row: idx + 2, // +2 for header + 1-based
              message: 'Ligne ignorée : aucune colonne reconnue.',
            });
          }
        });

        resolve({
          success: errors.length === 0,
          data: mappedData,
          errors,
        });
      } catch (err) {
        reject(new Error('Erreur lors de la lecture du fichier Excel.'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Erreur lors de la lecture du fichier.'));
    };

    reader.readAsArrayBuffer(file);
  });
}

/**
 * Helper to trigger a file picker and return the selected file.
 */
export function openFilePicker(
  accept = '.csv,.xlsx,.xls',
): Promise<File | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept;
    input.style.display = 'none';

    input.addEventListener('change', () => {
      const file = input.files?.[0] ?? null;
      resolve(file);
    });

    input.addEventListener('cancel', () => {
      resolve(null);
    });

    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  });
}
