"use client"
import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CheckSquare, Plus, Trash2, CheckCircle2 } from "lucide-react"

export default function TasksPage() {
  const [tasks, setTasks] = useState<{id: number, text: string, done: boolean}[]>([])
  const [input, setInput] = useState("")

  const addTask = () => {
    if (!input.trim()) return
    setTasks([...tasks, { id: Date.now(), text: input, done: false }])
    setInput("")
  }

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(t => t.id !== id))
  }

  return (
    <DashboardLayout title="قائمة المهام" description="نظم أفكارك ومهامك اليومية ببساطة">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex gap-2">
          <Input 
            placeholder="أضف مهمة جديدة..." 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
            className="py-6 rounded-2xl shadow-sm"
          />
          <Button onClick={addTask} className="h-auto px-6 rounded-2xl bg-orange-500 hover:bg-orange-600">
            <Plus />
          </Button>
        </div>

        <div className="space-y-3">
          {tasks.length > 0 ? tasks.map(task => (
            <Card key={task.id} className={`transition-all ${task.done ? 'opacity-50 bg-gray-50' : 'bg-white shadow-sm'}`}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => toggleTask(task.id)}>
                  {task.done ? <CheckCircle2 className="text-orange-500" /> : <div className="w-5 h-5 border-2 rounded-full border-gray-300" />}
                  <span className={task.done ? 'line-through text-gray-500' : 'font-medium'}>{task.text}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)} className="text-gray-400 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          )) : (
            <div className="text-center py-20 opacity-30">
              <CheckSquare size={60} className="mx-auto mb-4" />
              <p>لا توجد مهام حالياً.. ابدأ بالإنجاز!</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}