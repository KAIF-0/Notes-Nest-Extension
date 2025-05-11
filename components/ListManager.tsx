import {
  ChevronDown,
  ChevronRight,
  Clipboard,
  Lock,
  Plus,
  Trash2,
  Unlock
} from "lucide-react"
import React, { useEffect, useState } from "react"

import ListStorage from "../lib/storage"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "./ui/accordion"
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
import { Checkbox } from "./ui/checkbox"
import { Input } from "./ui/input"

interface ListItem {
  id: string
  text: string
  isHidden: boolean
}

interface List {
  id: string
  heading: string
  items: ListItem[]
}

const ListManager: React.FC = () => {
  const [lists, setLists] = useState<List[]>([])
  const [heading, setHeading] = useState("")
  const [newItems, setNewItems] = useState<ListItem[]>([
    { id: Date.now().toString(), text: "", isHidden: false }
  ])
  const [showHiddenItems, setShowHiddenItems] = useState<
    Record<string, boolean>
  >({})

  useEffect(() => {
    const saveCredentials = async (key: string) => {
      const savedLists = await ListStorage.storage.get(key)
      if (savedLists) {
        setLists(JSON.parse(savedLists))
      }
    }
    saveCredentials("listManager")
  }, [])

  useEffect(() => {
    ListStorage.storage.set("listManager", JSON.stringify(lists))
  }, [lists])

  const addNewItemField = () => {
    setNewItems([
      ...newItems,
      { id: Date.now().toString(), text: "", isHidden: false }
    ])
  }

  const updateNewItem = (id: string, text: string) => {
    setNewItems(
      newItems.map((item) => (item.id === id ? { ...item, text } : item))
    )
  }

  const toggleItemHidden = (id: string) => {
    setNewItems(
      newItems.map((item) =>
        item.id === id ? { ...item, isHidden: !item.isHidden } : item
      )
    )
  }

  const removeNewItem = (id: string) => {
    if (newItems.length === 1) {
      setNewItems([{ id: Date.now().toString(), text: "", isHidden: false }])
      return
    }
    setNewItems(newItems.filter((item) => item.id !== id))
  }

  const handleCreateList = () => {
    if (!heading) {
      return
    }

    const validItems = newItems.filter((item) => item.text.trim())

    if (validItems.length === 0) {
      return
    }

    const newList: List = {
      id: Date.now().toString(),
      heading,
      items: validItems
    }

    setLists([...lists, newList])
    setHeading("")
    setNewItems([{ id: Date.now().toString(), text: "", isHidden: false }])
  }

  const handleDeleteList = (listId: string) => {
    setLists(lists.filter((list) => list.id !== listId))
  }

  const handleDeleteItem = (listId: string, itemId: string) => {
    setLists(
      lists.map((list) => {
        if (list.id === listId) {
          return {
            ...list,
            items: list.items.filter((item) => item.id !== itemId)
          }
        }
        return list
      })
    )
  }

  const toggleShowHiddenItems = (listId: string) => {
    setShowHiddenItems((prev) => ({
      ...prev,
      [listId]: !prev[listId]
    }))
  }

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
  }

  const copyListContent = (list: List) => {
    const formattedList = `${list.heading}\n${list.items.map((item) => `- ${item.text}`).join("\n")}`
    copyToClipboard(formattedList, "List")
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3 bg-white rounded-lg p-4 shadow-sm">
        <div>
          <label htmlFor="heading" className="text-sm font-medium block mb-1">
            List Heading
          </label>
          <Input
            id="heading"
            placeholder="Enter list heading"
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium block">List Items</label>

          {newItems.map((item, index) => (
            <div key={item.id} className="flex items-center gap-2">
              <Input
                placeholder={`Item ${index + 1}`}
                value={item.text}
                onChange={(e) => updateNewItem(item.id, e.target.value)}
              />

              <Checkbox
                checked={item.isHidden}
                onCheckedChange={() => toggleItemHidden(item.id)}
                aria-label="Hide item"
              />

              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeNewItem(item.id)}
                aria-label="Remove item">
                <Trash2 size={16} />
              </Button>
            </div>
          ))}

          <Button
            variant="outline"
            onClick={addNewItemField}
            size="sm"
            className="w-full">
            <Plus size={16} className="mr-1" /> Add Item
          </Button>
        </div>

        <div className="flex-col justify-between items-center">
          <Button
            onClick={handleCreateList}
            className="w-full"
            disabled={
              !heading.trim() ||
              newItems.filter((item) => item.text.trim()).length === 0
            }
            // title={!heading || newItems.filter((item) => item.text.trim()).length === 0 ? "Disabled" : ""}
          >
            Create List
          </Button>
          <p className="text-xs mt-2">
            * Use checkboxes to mark items as hidden (can be shown/hidden later)
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Lists</h2>

        {lists.length === 0 ? (
          <p className="text-muted-foreground text-center py-6">
            No lists created yet
          </p>
        ) : (
          <Accordion type="multiple" className="space-y-3">
            {lists.map((list) => (
              <AccordionItem
                key={list.id}
                value={list.id}
                className="border bg-white rounded-md hover-scale overflow-hidden">
                <div className="flex items-center justify-between">
                  <AccordionTrigger className="flex flex-1 items-center py-4 px-5 hover:no-underline">
                    <span className="font-medium">{list.heading}</span>
                  </AccordionTrigger>

                  <div className="flex items-center pr-4 space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        copyListContent(list)
                      }}
                      aria-label="Copy list">
                      <Clipboard size={16} />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => handleDeleteList(list.id)}
                      aria-label="Delete list">
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>

                <AccordionContent className="p-4 pt-0">
                  {list.items.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      This list is empty
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {list.items.some((item) => item.isHidden) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleShowHiddenItems(list.id)}
                          className="mb-2">
                          {showHiddenItems[list.id] ? (
                            <>
                              <Unlock size={14} className="mr-1" /> Hide
                              Sensitive Items
                            </>
                          ) : (
                            <>
                              <Lock size={14} className="mr-1" /> Show Hidden
                              Items
                            </>
                          )}
                        </Button>
                      )}

                      <ul className="space-y-2">
                        {list.items.map((item) => (
                          <li
                            key={item.id}
                            className="flex items-center justify-between py-1 px-2 rounded hover:bg-gray-50">
                            <div className="flex items-center space-x-2">
                              {item.isHidden ? (
                                <>
                                  <Lock
                                    size={14}
                                    className="text-muted-foreground"
                                  />
                                  <span>
                                    {showHiddenItems[list.id]
                                      ? item.text
                                      : "••••••••••••"}
                                  </span>
                                </>
                              ) : (
                                <span>{item.text}</span>
                              )}
                            </div>

                            <div className="flex space-x-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() =>
                                  copyToClipboard(item.text, "Item")
                                }
                                aria-label="Copy item">
                                <Clipboard size={14} />
                              </Button>

                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive"
                                onClick={() =>
                                  handleDeleteItem(list.id, item.id)
                                }
                                aria-label="Delete item">
                                <Trash2 size={14} />
                              </Button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </div>
  )
}

export default ListManager
