import { Clipboard, Eye, EyeOff, Trash2 } from "lucide-react"
import React, { useEffect, useState } from "react"

import PasswordStorage from "../lib/storage"
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
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"

interface Credential {
  id: string
  site: string
  username: string
  password: string
}

const PasswordManager: React.FC = () => {
  const [credentials, setCredentials] = useState<Credential[]>([])
  const [site, setSite] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const saveCredentials = async (key: string) => {
      const savedCredentials = await PasswordStorage.storage.get(key)
      if (savedCredentials) {
        setCredentials(JSON.parse(savedCredentials))
      }
    }
    saveCredentials("passwordManager")
  }, [])

  useEffect(() => {
    PasswordStorage.storage.set("passwordManager", JSON.stringify(credentials))
  }, [credentials])

  const handleSave = () => {
    if (!site || !username || !password) {
      return
    }

    const newCredential: Credential = {
      id: Date.now().toString(),
      site,
      username,
      password
    }

    setCredentials([...credentials, newCredential])
    setSite("")
    setUsername("")
    setPassword("")
  }

  const handleDelete = (id: string) => {
    setCredentials(credentials.filter((cred) => cred.id !== id))
  }

  const togglePasswordVisibility = (id: string) => {
    setShowPassword({
      ...showPassword,
      [id]: !showPassword[id]
    })
  }

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
  }

  useEffect(() => {
    console.log(window.location.href)
  }, [])

  return (
    <div className="space-y-6">
      <Card>
        {/* <CardHeader>
          <CardTitle className="text-xl">Add New Credential</CardTitle>
        </CardHeader> */}
        <CardContent>
          <div className="space-y-3 mt-4">
            <div>
              <label htmlFor="site" className="text-sm font-medium block mb-1">
                Site
              </label>
              <Input
                id="site"
                placeholder="Website URL or name"
                value={site}
                onChange={(e) => setSite(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="username"
                className="text-sm font-medium block mb-1">
                Email/Username
              </label>
              <Input
                id="username"
                placeholder="Email or username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="relative">
              <label
                htmlFor="password"
                className="text-sm font-medium block mb-1">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword["new"] ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={() => togglePasswordVisibility("new")}
                  className="absolute right-0 top-0 h-full"
                  aria-label={
                    showPassword["new"] ? "Hide password" : "Show password"
                  }>
                  {showPassword["new"] ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            disabled={!site.trim() || !username.trim() || !password.trim()}
            onClick={handleSave}>
            Save Credential
          </Button>
        </CardFooter>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Saved Credentials</h2>

        {credentials.length === 0 ? (
          <p className="text-muted-foreground text-center py-6">
            No saved credentials yet
          </p>
        ) : (
          <div className="space-y-3">
            {credentials.map((cred) => (
              <Card key={cred.id} className="hover-scale">
                <CardContent className="pt-6 pb-3">
                  <div className="flex justify-between items-center mb-2">
                    <a
                      href={cred.site}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold hover:underline text-blue-600">
                      {cred.site}
                    </a>
                    <Button
                      onClick={() => handleDelete(cred.id)}
                      variant="ghost"
                      size="icon"
                      className="text-destructive opacity-80 hover:opacity-100"
                      aria-label="Delete credential">
                      <Trash2 size={16} />
                    </Button>
                  </div>

                  <div className="flex justify-between items-center border-b py-2">
                    <span className="text-sm truncate max-w-[70%]">
                      {cred.username}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(cred.username, "Username")}
                      className="h-8"
                      aria-label="Copy username">
                      <Clipboard size={14} className="mr-1" />
                      Copy
                    </Button>
                  </div>

                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm truncate max-w-[70%]">
                      {showPassword[cred.id] ? cred.password : "••••••••••••"}
                    </span>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => togglePasswordVisibility(cred.id)}
                        className="h-8"
                        aria-label={
                          showPassword[cred.id]
                            ? "Hide password"
                            : "Show password"
                        }>
                        {showPassword[cred.id] ? (
                          <EyeOff size={14} />
                        ) : (
                          <Eye size={14} />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(cred.password, "Password")
                        }
                        className="h-8"
                        aria-label="Copy password">
                        <Clipboard size={14} className="mr-1" />
                        Copy
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default PasswordManager
