"use client"

import { useEditor, EditorContent, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import YouTube from '@tiptap/extension-youtube'
import Link from '@tiptap/extension-link'
// --- THIS LINE IS THE FIX ---
import { useCallback, useEffect } from 'react' // Added useEffect
import { Bold, Italic, Strikethrough, Code, List, ListOrdered, Quote, Youtube, ImageIcon, Link as LinkIcon, Minus } from 'lucide-react'
import { Button } from './ui/button'

type ToolbarButtonProps = {
  onClick: () => void;
  disabled?: boolean;
  isActive?: boolean;
  children: React.ReactNode;
}

const ToolbarButton = ({ onClick, disabled, isActive, children }: ToolbarButtonProps) => (
    <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={onClick}
        disabled={disabled}
        className={isActive ? 'bg-[#61E8E1] text-[#0D0D0D]' : ''}
    >
        {children}
    </Button>
);

const EditorToolbar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null
  }

  const addImage = useCallback(() => {
    const url = window.prompt('Enter image URL:')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])

  const addYoutubeVideo = useCallback(() => {
    const url = prompt('Enter YouTube URL')
    if (url) {
      editor.commands.setYoutubeVideo({ src: url })
    }
  }, [editor])
  
  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('Enter URL:', previousUrl)

    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  return (
    <div className="border border-b-0 border-input bg-transparent rounded-t-md p-1 flex flex-wrap gap-1">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} disabled={!editor.can().chain().focus().toggleBold().run()} isActive={editor.isActive('bold')}>
            <Bold className="h-4 w-4"/>
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} disabled={!editor.can().chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')}>
            <Italic className="h-4 w-4"/>
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} disabled={!editor.can().chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')}>
            <Strikethrough className="h-4 w-4"/>
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')}>
            <Quote className="h-4 w-4"/>
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')}>
            <List className="h-4 w-4"/>
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')}>
            <ListOrdered className="h-4 w-4"/>
        </ToolbarButton>
        <ToolbarButton onClick={addImage}>
            <ImageIcon className="h-4 w-4"/>
        </ToolbarButton>
        <ToolbarButton onClick={addYoutubeVideo}>
            <Youtube className="h-4 w-4"/>
        </ToolbarButton>
        <ToolbarButton onClick={setLink} isActive={editor.isActive('link')}>
            <LinkIcon className="h-4 w-4"/>
        </ToolbarButton>
    </div>
  )
}

export function RichTextEditor({ content, onUpdate, disabled = false }: { content: string; onUpdate: (content: string) => void; disabled?: boolean; }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
      }),
      Image.configure({ inline: true, allowBase64: true }),
      YouTube.configure({ controls: false, nocookie: true }),
      Link.configure({ openOnClick: false, autolink: true }),
    ],
    content: content,
    onUpdate: ({ editor }) => { onUpdate(editor.getHTML()); },
    editable: !disabled,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base focus:outline-none min-h-[250px] p-4 text-[#EAEAEA] prose-invert',
      },
    },
  });
  
  useEffect(() => {
    if (editor) {
        editor.setEditable(!disabled);
    }
  }, [disabled, editor]);

  return (
    <div className="bg-[#0D0D0D] border border-[#333] rounded-md">
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} className="[&_.ProseMirror]:p-4 [&_.ProseMirror-focused]:outline-none" />
    </div>
  );
}
