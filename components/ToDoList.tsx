import { Calendar, Check, Clipboard, Trash2 } from "lucide-react"
import React, { useEffect, useState } from "react"

import ToDoStorage from "../lib/storage"
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
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { Input } from "./ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "./ui/select"

type Priority = "high" | "medium" | "low"

interface Task {
  id: string
  name: string
  priority: Priority
  dueDate: string | null
  category: string
  isCompleted: boolean
}

const ToDoList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [taskName, setTaskName] = useState("")
  const [priority, setPriority] = useState<Priority>("medium")
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined)
  const [category, setCategory] = useState("")
  const [filterPriority, setFilterPriority] = useState<Priority | "all">("all")
  const [showCompleted, setShowCompleted] = useState(false)

  useEffect(() => {
    const saveCredentials = async (key: string) => {
      const savedCredentials = await ToDoStorage.storage.get(key)
      if (savedCredentials) {
        setTasks(JSON.parse(savedCredentials))
      }
    }
    saveCredentials("todoList")
  }, [])

  useEffect(() => {
    ToDoStorage.storage.set("todoList", JSON.stringify(tasks))
  }, [tasks])

  const handleSave = () => {
    if (!taskName) {
      return
    }

    const newTask: Task = {
      id: Date.now().toString(),
      name: taskName,
      priority,
      dueDate: dueDate ? dueDate.toISOString().split("T")[0] : null,
      category: category || "General",
      isCompleted: false
    }

    setTasks([...tasks, newTask])
    setTaskName("")
    setPriority("medium")
    setDueDate(undefined)
    setCategory("")
  }

  const handleDelete = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const toggleTaskCompletion = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
      )
    )
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const filteredTasks = tasks.filter((task) => {
    if (!showCompleted && task.isCompleted) return false
    if (filterPriority !== "all" && task.priority !== filterPriority)
      return false
    return true
  })

  return (
    <div className="space-y-6">
      <Card className="bg-white">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="taskName"
                className="text-sm font-medium block mb-1">
                Task Name
              </label>
              <Input
                id="taskName"
                placeholder="What needs to be done?"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="priority"
                  className="text-sm font-medium block mb-1">
                  Priority
                </label>
                <Select
                  value={priority}
                  onValueChange={(value) => setPriority(value as Priority)}>
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="text-sm font-medium block mb-1">
                  Category
                </label>
                <Input
                  id="category"
                  placeholder="Optional category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="dueDate"
                className="text-sm font-medium block mb-1">
                Due Date (Optional)
              </label>
              <input
                type="date"
                id="dueDate"
                className={cn(
                  "w-full border rounded-md px-3 py-2 text-sm",
                  !dueDate && "text-muted-foreground"
                )}
                value={dueDate ? dueDate.toISOString().split("T")[0] : ""}
                onChange={(e) =>
                  setDueDate(
                    e.target.value ? new Date(e.target.value) : undefined
                  )
                }
              />
            </div>

            <div className="pt-2">
              <Button
                disabled={!taskName.trim()}
                onClick={handleSave}
                className="w-full">
                Add Task
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Tasks</h2>
        <div className="flex space-x-2">
          <Select
            value={filterPriority}
            onValueChange={(value) =>
              setFilterPriority(value as Priority | "all")
            }>
            <SelectTrigger
              className="w-[130px]"
              aria-label="Filter by priority">
              <SelectValue placeholder="Filter by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All priorities</SelectItem>
              <SelectItem value="high">High priority</SelectItem>
              <SelectItem value="medium">Medium priority</SelectItem>
              <SelectItem value="low">Low priority</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => setShowCompleted(!showCompleted)}>
            {showCompleted ? "Hide Completed" : "Show Completed"}
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <p className="text-muted-foreground text-center py-6">
            No tasks found
          </p>
        ) : (
          filteredTasks.map((task) => (
            <Card
              key={task.id}
              className={cn(
                "hover-scale transition-all",
                task.isCompleted ? "opacity-75" : ""
              )}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className={cn(
                        "rounded-full h-6 w-6 mt-0.5",
                        task.isCompleted && "bg-primary text-white"
                      )}
                      onClick={() => toggleTaskCompletion(task.id)}
                      aria-label={
                        task.isCompleted
                          ? "Mark as incomplete"
                          : "Mark as complete"
                      }>
                      {task.isCompleted && <Check size={12} />}
                    </Button>

                    <div className="space-y-1">
                      <h3
                        className={cn(
                          "font-medium",
                          task.isCompleted &&
                            "line-through text-muted-foreground"
                        )}>
                        {task.name}
                      </h3>

                      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <Badge
                          className={cn(
                            "bg-priority-medium",
                            task.priority === "high" && "bg-priority-high",
                            task.priority === "low" && "bg-priority-low"
                          )}>
                          {task.priority}
                        </Badge>

                        {task.category && (
                          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs">
                            {task.category}
                          </span>
                        )}

                        {task.dueDate && (
                          <span className="inline-flex items-center gap-1">
                            <Calendar size={14} />
                            {task.dueDate}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(task.name)}
                      aria-label="Copy task name">
                      <Clipboard size={16} />
                    </Button>

                    <Button
                      onClick={() => handleDelete(task.id)}
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      aria-label="Delete task">
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

export default ToDoList
