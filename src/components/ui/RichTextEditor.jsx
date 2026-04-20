import React, { useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import { TextStyle, FontSize } from '@tiptap/extension-text-style';
import {
  Bold, Italic, Underline as UnderlineIcon, List, ListOrdered,
  Heading2, Heading3, Link as LinkIcon, Undo, Redo,
  Type, Eraser
} from 'lucide-react';

// ── Tamanhos de fonte disponíveis ──────────────────────────────────────────
const FONT_SIZES = [8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 20, 24, 28, 32, 36, 48];

// ── Botão de toolbar ───────────────────────────────────────────────────────
const Btn = ({ onClick, active, disabled, title, children }) => (
  <button
    type="button"
    onMouseDown={(e) => { e.preventDefault(); onClick?.(); }}
    disabled={disabled}
    title={title}
    className={`p-1.5 rounded text-sm transition-colors
      ${active
        ? 'bg-primary text-white shadow'
        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'}
      disabled:opacity-30 disabled:cursor-not-allowed`}
  >
    {children}
  </button>
);

// ── Separador vertical ─────────────────────────────────────────────────────
const Sep = () => <div className="w-px h-5 bg-gray-200 mx-0.5 self-center" />;

// ── Componente principal ───────────────────────────────────────────────────
const RichTextEditor = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: true,
      }),
      Underline,
      TextStyle,
      FontSize.configure({ types: ['textStyle'] }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline decoration-accent font-bold cursor-pointer',
        },
      }),
    ],
    content: content || '',
    onUpdate({ editor }) {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          'min-h-[140px] p-4 bg-white focus:outline-none text-sm text-gray-800 leading-relaxed',
      },
    },
  });

  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes('link').href;
    const url = window.prompt('URL do Link:', prev ?? 'https://');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  }, [editor]);

  if (!editor) return null;

  // Tamanho atual do cursor/seleção
  const currentSize =
    editor.getAttributes('textStyle').fontSize?.replace('px', '') ?? '';

  const handleSizeChange = (e) => {
    const val = e.target.value;
    editor.chain().focus().setFontSize(val ? `${val}px` : '').run();
  };

  return (
    <div className="w-full flex flex-col border border-gray-200 rounded-xl overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all">

      {/* ── Barra de ferramentas ── */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 bg-gray-50 border-b border-gray-100">

        {/* Negrito / Itálico / Sublinhado */}
        <Btn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Negrito (Ctrl+B)">
          <Bold size={15} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Itálico (Ctrl+I)">
          <Italic size={15} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Sublinhado (Ctrl+U)">
          <UnderlineIcon size={15} />
        </Btn>

        <Sep />

        {/* ── Seletor de Tamanho de Fonte ── */}
        <div className="flex items-center gap-1">
          <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest select-none pl-1">Tam.</span>
          <select
            value={currentSize}
            onChange={handleSizeChange}
            title="Tamanho da Fonte"
            className="text-[11px] font-bold text-gray-700 bg-white border border-gray-200 rounded px-1.5 py-1 focus:outline-none focus:ring-1 focus:ring-primary/30 cursor-pointer hover:border-primary/40 transition-colors"
          >
            <option value="">—</option>
            {FONT_SIZES.map((s) => (
              <option key={s} value={s}>{s}px</option>
            ))}
          </select>
        </div>

        <Sep />

        {/* Títulos semânticos */}
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} title="Título H1 — Extra Grande">
          <span className="font-black text-[10px] leading-none">H1</span>
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Título H2 — Grande">
          <Heading2 size={15} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Título H3 — Médio">
          <Heading3 size={15} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()} active={editor.isActive('heading', { level: 4 })} title="Título H4 — Pequeno">
          <span className="font-bold text-[10px] leading-none">H4</span>
        </Btn>
        <Btn onClick={() => editor.chain().focus().setParagraph().run()} active={editor.isActive('paragraph')} title="Texto normal (parágrafo)">
          <Type size={15} />
        </Btn>

        <Sep />

        {/* Listas */}
        <Btn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Lista com marcadores">
          <List size={15} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Lista numerada">
          <ListOrdered size={15} />
        </Btn>

        <Sep />

        {/* Link / Limpar */}
        <Btn onClick={setLink} active={editor.isActive('link')} title="Inserir / editar link">
          <LinkIcon size={15} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()} title="Limpar toda a formatação">
          <Eraser size={15} />
        </Btn>

        {/* Desfazer / Refazer — direita */}
        <div className="ml-auto flex items-center gap-0.5">
          <Btn onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Desfazer (Ctrl+Z)">
            <Undo size={15} />
          </Btn>
          <Btn onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Refazer (Ctrl+Y)">
            <Redo size={15} />
          </Btn>
        </div>
      </div>

      {/* ── Área de conteúdo ── */}
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
