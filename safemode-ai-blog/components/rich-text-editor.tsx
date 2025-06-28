"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import YouTube from '@tiptap/extension-youtube'
import Link from '@tiptap/extension-link'
import { useCallback } from 'react'
import { Bold, Italic, Strikethrough, Code, List, ListOrdered, Quote, Youtube, ImageIcon, LinkIcon } from 'lucide-react'
import { Button } from './ui/button'

const EditorToolbar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null
  }

  const addImage = useCallback(() => {
    const url = window.prompt('Enter the URL of the image:')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])

  const addYoutubeVideo = () => {
    const url = prompt('Enter YouTube URL')
    if (url) {
      editor.commands.setYoutubeVideo({ src: url })
    }
  }
  
  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])


  return (
    <div className="border border-input bg-transparent rounded-t-md p-2 flex flex-wrap gap-2">
        <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleBold().run()} disabled={!editor.can().chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'is-active' : ''}><Bold className="h-4 w-4"/></Button>
        <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleItalic().run()} disabled={!editor.can().chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'is-active' : ''}><Italic className="h-4 w-4"/></Button>
        <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleStrike().run()} disabled={!editor.can().chain().focus().toggleStrike().run()} className={editor.isActive('strike') ? 'is-active' : ''}><Strikethrough className="h-4 w-4"/></Button>
        <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={editor.isActive('blockquote') ? 'is-active' : ''}><Quote className="h-4 w-4"/></Button>
        <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'is-active' : ''}><List className="h-4 w-4"/></Button>
        <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'is-active' : ''}><ListOrdered className="h-4 w-4"/></Button>
        <Button variant="ghost" size="sm" onClick={addImage}><ImageIcon className="h-4 w-4"/></Button>
        <Button variant="ghost" size="sm" onClick={addYoutubeVideo}><Youtube className="h-4 w-4"/></Button>
        <Button variant="ghost" size="sm" onClick={setLink} className={editor.isActive('link') ? 'is-active' : ''}><LinkIcon className="h-4 w-4"/></Button>
    </div>
  )
}


export function RichTextEditor({ content, onUpdate }: { content: string; onUpdate: (content: string) => void }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
      }),
      Image,
      YouTube.configure({
        controls: false,
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
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none min-h-[200px] text-white',
      },
    },
  });

  return (
    <div className="bg-[#0D0D0D] border border-[#333] rounded-md">
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
