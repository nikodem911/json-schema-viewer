import { useState } from 'react';

type SchemaPasteInputProps = {
  onSchemaLoaded: (schema: any) => void;
};

export function SchemaPasteInput({ onSchemaLoaded }: SchemaPasteInputProps) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const apply = () => {
    try {
      const parsed = JSON.parse(text);
      if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
        throw new Error('Schema must be a JSON object.');
      }
      setError(null);
      onSchemaLoaded(parsed);
      setOpen(false);
    } catch (e: any) {
      setError(e?.message ?? String(e));
    }
  };

  if (!open) {
    return (
      <div style={{ padding: '8px 16px' }}>
        <button type="button" onClick={() => setOpen(true)}>
          Paste schema...
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '8px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <label htmlFor="schema-paste-input">Paste JSON Schema:</label>
      <textarea
        id="schema-paste-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) apply();
        }}
        placeholder='{ "$schema": "https://json-schema.org/draft/2020-12/schema", ... }'
        spellCheck={false}
        rows={12}
        style={{ fontFamily: 'monospace', fontSize: 12, width: '100%', boxSizing: 'border-box' }}
        autoFocus
      />
      {error && <div style={{ color: '#c00', whiteSpace: 'pre-wrap' }}>Invalid schema: {error}</div>}
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="button" onClick={apply} disabled={!text.trim()}>
          Show schema
        </button>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setError(null);
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
