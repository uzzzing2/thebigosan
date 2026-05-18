'use client'

import { useEditor, EditorContent, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import LinkExtension from '@tiptap/extension-link'
import ImageExtension from '@tiptap/extension-image'
import { useEffect } from 'react'
import {
  Bars3BottomLeftIcon,
  BoldIcon,
  ItalicIcon,
  LinkIcon,
  ListBulletIcon,
  NumberedListIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/cn'

export interface RichTextEditorProps {
  value: string
  onChange: (html: string) => void
  placeholder?: string
}

function ToolbarButton({
  active,
  onClick,
  children,
  ariaLabel,
}: {
  active?: boolean
  onClick: () => void
  children: React.ReactNode
  ariaLabel: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      aria-pressed={active}
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-700 transition-colors hover:bg-gray-100',
        active && 'bg-red-50 text-red-500',
      )}
    >
      {children}
    </button>
  )
}

function Toolbar({ editor }: { editor: Editor }) {
  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 px-2 py-1.5">
      <ToolbarButton
        ariaLabel="제목 2"
        active={editor.isActive('heading', { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Bars3BottomLeftIcon className="h-5 w-5" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton
        ariaLabel="굵게"
        active={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <BoldIcon className="h-5 w-5" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton
        ariaLabel="기울임"
        active={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <ItalicIcon className="h-5 w-5" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton
        ariaLabel="글머리 기호"
        active={editor.isActive('bulletList')}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <ListBulletIcon className="h-5 w-5" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton
        ariaLabel="번호 목록"
        active={editor.isActive('orderedList')}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <NumberedListIcon className="h-5 w-5" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton
        ariaLabel="링크"
        active={editor.isActive('link')}
        onClick={() => {
          const url = prompt('링크 URL을 입력하세요 (취소하면 링크 해제)')
          if (url === null) return
          if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run()
            return
          }
          editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
        }}
      >
        <LinkIcon className="h-5 w-5" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton
        ariaLabel="이미지"
        onClick={() => {
          const url = prompt('이미지 URL을 입력하세요')
          if (!url) return
          editor.chain().focus().setImage({ src: url }).run()
        }}
      >
        <PhotoIcon className="h-5 w-5" aria-hidden="true" />
      </ToolbarButton>
    </div>
  )
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      LinkExtension.configure({ openOnClick: false, autolink: true }),
      ImageExtension,
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          'prose prose-lg max-w-none min-h-[280px] px-4 py-3 focus:outline-none prose-headings:text-gray-900 prose-a:text-red-500',
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML())
    },
    immediatelyRender: false,
  })

  // Sync external value changes (e.g. when loading existing post)
  useEffect(() => {
    if (!editor) return
    if (value && value !== editor.getHTML()) {
      editor.commands.setContent(value, false)
    }
  }, [value, editor])

  if (!editor) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-4 text-body-small text-gray-500">
        에디터 불러오는 중…
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} placeholder={placeholder} />
    </div>
  )
}
