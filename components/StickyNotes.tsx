import { Bell, Clipboard, Pin, Search, Trash2 } from "lucide-react"
import React, { useEffect, useState } from "react"

import StickyNotesStorage from "../lib/storage"
import { cn } from "../lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "./ui/alert-dialog"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"

interface StickyNote {
  id: string
  content: string
  color: string
  position?: { x: number; y: number }
}

const colorOptions = [
  { name: "Yellow", value: "note-yellow", class: "bg-note-yellow" },
  { name: "Blue", value: "note-blue", class: "bg-note-blue" },
  { name: "Pink", value: "note-pink", class: "bg-note-pink" },
  { name: "Purple", value: "note-purple", class: "bg-note-purple" },
  { name: "Peach", value: "note-peach", class: "bg-note-peach" }
]

const StickyNotes: React.FC = () => {
  const [notes, setNotes] = useState<StickyNote[]>([])
  const [filteredNotes, setFilteredNotes] = useState<StickyNote[]>([...notes])
  const [newNoteContent, setNewNoteContent] = useState("")
  const [selectedColor, setSelectedColor] = useState("note-yellow")

  useEffect(() => {
    const getCredentials = async (key: string) => {
      const savedCredentials = await StickyNotesStorage.storage.get(key)
      if (savedCredentials) {
        setNotes(JSON.parse(savedCredentials))
        setFilteredNotes(JSON.parse(savedCredentials))
      }
    }
    getCredentials("stickyNotes")
  }, [])

  useEffect(() => {
    StickyNotesStorage.storage.set("stickyNotes", JSON.stringify(notes))
  }, [notes])

  const handleCreateNote = () => {
    if (!newNoteContent.trim()) {
      return
    }

    const newNote: StickyNote = {
      id: Date.now().toString(),
      content: newNoteContent,
      color: selectedColor
    }

    setNotes([...notes, newNote])
    setFilteredNotes([...filteredNotes, newNote])
    setNewNoteContent("")
  }

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id))
    setFilteredNotes(filteredNotes.filter((note) => note.id !== id))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getColorClass = (colorValue: string) => {
    return (
      colorOptions.find((color) => color.value === colorValue)?.class ||
      "bg-note-yellow"
    )
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value.toLowerCase().trim()

    if (searchValue) {
      setFilteredNotes(
        notes.filter((note) => note.content.includes(searchValue))
      )
    } else {
      setFilteredNotes(notes)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label
            htmlFor="noteContent"
            className="text-sm font-medium block mb-1">
            Note Content
          </label>
          <Textarea
            id="noteContent"
            placeholder="Type or paste content here..."
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            className="min-h-[100px]"
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-2">Note Color</label>
          <div className="flex flex-wrap gap-2">
            {colorOptions.map((color) => (
              <button
                key={color.value}
                className={cn(
                  "w-8 h-8 rounded-full transition-all",
                  color.class,
                  selectedColor === color.value
                    ? "ring-2 ring-offset-2 ring-primary"
                    : "opacity-70 hover:opacity-100"
                )}
                onClick={() => setSelectedColor(color.value)}
                aria-label={`Select ${color.name} color`}
                title={color.name}
              />
            ))}
          </div>
        </div>

        <Button
          disabled={!newNoteContent.trim()}
          onClick={handleCreateNote}
          className="w-full">
          Create Note
        </Button>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Notes</h2>
        <div className="flex items-center min-w-9">
          <input
            type="text"
            placeholder="Search..."
            onChange={handleSearch}
            className="w-52 px-2 py-2 border-2 note-shadow border-gray-300 rounded-lg focus:outline-gray-400 text-gray-500 flex-1"
          />
        </div>
      </div>

      {filteredNotes.length === 0 ? (
        <p className="text-muted-foreground text-center py-6">
          No sticky notes yet
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className={cn(
                getColorClass(note.color),
                "rounded-md p-4 note-shadow relative hover-scale"
              )}>
              <div className="flex justify-end space-x-1 absolute top-2 right-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-white bg-opacity-30"
                  onClick={() => copyToClipboard(note.content)}
                  aria-label="Copy note">
                  <Clipboard size={14} />
                </Button>

                <Button
                  onClick={() => handleDeleteNote(note.id)}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-white bg-opacity-30 text-destructive"
                  aria-label="Delete note">
                  <Trash2 size={14} />
                </Button>
              </div>

              <Pin size={16} className="opacity-50 mb-2" />
              <div className="min-h-[100px] mt-4 whitespace-pre-wrap break-words">
                {note.content}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default StickyNotes
