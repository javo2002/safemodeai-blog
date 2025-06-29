"use client"

import { useEditor, EditorContent, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import YouTube from '@tiptap/extension-youtube'
import Link from '@tiptap/extension-link'
import { useCallback, useEffect } from 'react'
import { Bold, Italic, Strikethrough, List, ListOrdered, Quote, Youtube, ImageIcon, Link as LinkIcon } from 'lucide-react'
import { Button } from './ui/button'

// A helper component to make the toolbar buttons cleaner
type ToolbarButtonProps = {
  onClick: () => void;
  disabled?: boolean;
  isActive?: boolean;
  children: React.ReactNode;
  title: string;
}

const ToolbarButton = ({ onClick, disabled, isActive, children, title }: ToolbarButtonProps) => (
    <Button
        type="button"
        size="icon"
        variant="ghost"
        onClick={onClick}
        disabled={disabled}
        className={`h-8 w-8 p-2 ${isActive ? 'bg-[#61E8E1] text-[#0D0D0D] hover:bg-[#61E8E1]/90' : 'hover:bg-zinc-700'}`}
        title={title}
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
    <div className="border border-b-0 border-[#333] bg-[#1A1A1A] rounded-t-md p-1 flex flex-wrap gap-1">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} disabled={!editor.can().chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="Bold">
            <Bold className="h-4 w-4"/>
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} disabled={!editor.can().chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="Italic">
            <Italic className="h-4 w-4"/>
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} disabled={!editor.can().chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} title="Strikethrough">
            <Strikethrough className="h-4 w-4"/>
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} title="Blockquote">
            <Quote className="h-4 w-4"/>
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="Bullet List">
            <List className="h-4 w-4"/>
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} title="Numbered List">
            <ListOrdered className="h-4 w-4"/>
        </ToolbarButton>
        <ToolbarButton onClick={addImage} title="Add Image">
            <ImageIcon className="h-4 w-4"/>
        </ToolbarButton>
        <ToolbarButton onClick={addYoutubeVideo} title="Add YouTube Video">
            <Youtube className="h-4 w-4"/>
        </ToolbarButton>
        <ToolbarButton onClick={setLink} isActive={editor.isActive('link')} title="Add Link">
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
      Image.configure({
        inline: false, // Allows images to be on their own line
        allowBase64: true,
      }),
      YouTube.configure({
        controls: false,
        nocookie: true,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML());
    },
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
      <EditorContent editor={editor} className="[&_.ProseMirror]:p-4 [&_.ProseMirror-focused]:outline-none [&_img]:rounded-md [&_img]:mx-auto [&_iframe]:mx-auto" />
    </div>
  );
}

