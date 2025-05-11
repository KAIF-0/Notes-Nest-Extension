import { Bell, CheckSquare, ListTodo, Lock, StickyNote } from "lucide-react"
import React, { useEffect, useState } from "react"

import ListManager from "./components/ListManager"
import PasswordManager from "./components/PasswordManager"
import StickyNotes from "./components/StickyNotes"
import ToDoList from "./components/ToDoList"
import { Button } from "./components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs"

import "./style.css"

const Index = () => {
  const [activeTab, setActiveTab] = useState("todos")

  return (
    <div className="min-h-screen bg-slate-50 py-6 px-4 md:px-8">
      <div className="max-w-5xl mx-auto space-y-4">
        <header className="flex-col justify-center items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-center">
            Productivity Dashboard
          </h1>
          <p className="text-muted-foreground text-center">
            Manage your passwords, tasks, notes, and lists in one place
          </p>
        </header>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm flex overflow-x-auto hide-scrollbar">
            <TabsList className="flex w-full h-auto px-2 py-2 w-aut0">
              <TabsTrigger
                value="todos"
                className="flex items-center py-1 px-4 flex-1">
                <CheckSquare className="w-4 h-4 mr-1" />
                <span className="hidden xs:inline">To-Do List</span>
                <span className="inline xs:hidden">Tasks</span>
              </TabsTrigger>
              <TabsTrigger
                value="notes"
                className="flex items-center py-1 px-4 flex-1">
                <StickyNote className="w-4 h-4 mr-1" />
                <span className="hidden xs:inline">Sticky Notes</span>
                <span className="inline xs:hidden">Notes</span>
              </TabsTrigger>
              <TabsTrigger
                value="lists"
                className="flex items-center py-1 px-4 flex-1">
                <ListTodo className="w-4 h-4 mr-1" />
                <span className="hidden xs:inline">List Manager</span>
                <span className="inline xs:hidden">Lists</span>
              </TabsTrigger>

              <TabsTrigger
                value="passwords"
                className="flex items-center py-1 px-4 flex-1">
                <Lock className="w-4 h-4 mr-1" />
                <span className="hidden xs:inline">Password Manager</span>
                <span className="inline xs:hidden">Passwords</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 min-h-[500px]">
            <TabsContent value="todos" className="mt-0">
              <ToDoList />
            </TabsContent>
            <TabsContent value="notes" className="mt-0">
              <StickyNotes />
            </TabsContent>

            <TabsContent value="lists" className="mt-0">
              <ListManager />
            </TabsContent>

            <TabsContent value="passwords" className="mt-0">
              <PasswordManager />
            </TabsContent>
          </div>
        </Tabs>

        <footer className=" text-center text-sm text-muted-foreground">
          <p>*Your data is stored locally in your browser.</p>
        </footer>
      </div>
    </div>
  )
}

export default Index
