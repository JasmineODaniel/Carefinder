import { useState } from 'react';
import { Download } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { ALL_COLUMNS, COLUMN_LABELS, exportHospitals, type ExportColumn } from './useExport';
import type { Hospital } from '../../types/hospital';

interface ExportModalProps {
  open: boolean;
  onClose: () => void;
  hospitals: Hospital[];
  query: string;
}

export function ExportModal({ open, onClose, hospitals, query }: ExportModalProps) {
  const [selected, setSelected] = useState<ExportColumn[]>([...ALL_COLUMNS]);

  function toggleColumn(col: ExportColumn) {
    setSelected((prev) =>
      prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col],
    );
  }

  function handleExport() {
    exportHospitals(hospitals, selected, query);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Export to CSV">
      <p className="mb-4 text-[13px] text-soft">
        {hospitals.length} hospital{hospitals.length !== 1 ? 's' : ''} will be exported. Select
        the columns to include:
      </p>

      <div className="mb-6 grid grid-cols-2 gap-2">
        {ALL_COLUMNS.map((col) => {
          const checked = selected.includes(col);
          return (
            <label
              key={col}
              className="flex cursor-pointer items-center gap-2.5 rounded-[5px] border border-line px-3 py-2.5 transition-colors hover:bg-muted"
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggleColumn(col)}
                className="size-4 rounded accent-accent"
              />
              <span className="text-[13px] font-medium text-ink">{COLUMN_LABELS[col]}</span>
            </label>
          );
        })}
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleExport} disabled={selected.length === 0}>
          <Download className="size-4" strokeWidth={2} />
          Export CSV
        </Button>
      </div>
    </Modal>
  );
}
