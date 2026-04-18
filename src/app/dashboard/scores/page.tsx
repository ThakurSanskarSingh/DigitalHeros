"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { TrendingUp, TrendingDown, Minus, Trash2, Edit2, Check, X, Plus } from "lucide-react"

// Types
interface Score {
  id: string
  score: number
  played_on: string
  created_at: string
}

interface Toast {
  id: number
  message: string
  type: "success" | "error"
}

export default function ScoresPage() {
  const [scores, setScores] = useState<Score[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [toasts, setToasts] = useState<Toast[]>([])

  // Form state
  const [newScore, setNewScore] = useState("")
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editScore, setEditScore] = useState("")
  const [editDate, setEditDate] = useState("")

  // Delete confirmation
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Fetch scores
  const fetchScores = async () => {
    try {
      const response = await fetch("/api/scores")
      if (!response.ok) throw new Error("Failed to fetch scores")

      const data = await response.json()
      setScores(data.scores || [])
    } catch (err) {
      setError("Failed to load scores")
      showToast("Failed to load scores", "error")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchScores()
  }, [])

  // Toast notification
  const showToast = (message: string, type: "success" | "error") => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3000)
  }

  // Handle add new score
  const handleAddScore = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newScore || !newDate) return

    const scoreValue = parseInt(newScore)
    if (scoreValue < 1 || scoreValue > 45) {
      showToast("Score must be between 1 and 45", "error")
      return
    }

    setIsSubmitting(true)

    // Optimistic update
    const tempScore: Score = {
      id: `temp-${Date.now()}`,
      score: scoreValue,
      played_on: newDate,
      created_at: new Date().toISOString()
    }

    setScores(prev => [tempScore, ...prev].slice(0, 5))
    setNewScore("")
    setNewDate(new Date().toISOString().split('T')[0])

    try {
      const response = await fetch("/api/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score: scoreValue, playedOn: newDate })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to add score")
      }

      // Replace temp with real score
      await fetchScores()
      showToast("Score added successfully!", "success")
    } catch (err: any) {
      // Revert optimistic update
      setScores(prev => prev.filter(s => s.id !== tempScore.id))
      showToast(err.message || "Failed to add score", "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle edit
  const startEdit = (score: Score) => {
    setEditingId(score.id)
    setEditScore(score.score.toString())
    setEditDate(score.played_on)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditScore("")
    setEditDate("")
  }

  const saveEdit = async (id: string) => {
    const scoreValue = parseInt(editScore)
    if (scoreValue < 1 || scoreValue > 45) {
      showToast("Score must be between 1 and 45", "error")
      return
    }

    // Optimistic update
    const oldScores = [...scores]
    setScores(prev => prev.map(s =>
      s.id === id ? { ...s, score: scoreValue, played_on: editDate } : s
    ))
    setEditingId(null)

    try {
      const response = await fetch(`/api/scores/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score: scoreValue, playedOn: editDate })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update score")
      }

      await fetchScores()
      showToast("Score updated successfully!", "success")
    } catch (err: any) {
      // Revert optimistic update
      setScores(oldScores)
      showToast(err.message || "Failed to update score", "error")
    }
  }

  // Handle delete
  const handleDelete = async (id: string) => {
    setDeletingId(id)

    // Wait for shake animation
    setTimeout(async () => {
      // Optimistic update
      const oldScores = [...scores]
      setScores(prev => prev.filter(s => s.id !== id))

      try {
        const response = await fetch(`/api/scores/${id}`, {
          method: "DELETE"
        })

        if (!response.ok) {
          throw new Error("Failed to delete score")
        }

        showToast("Score deleted successfully!", "success")
      } catch (err) {
        // Revert optimistic update
        setScores(oldScores)
        showToast("Failed to delete score", "error")
      } finally {
        setDeletingId(null)
      }
    }, 500)
  }

  // Calculate trend
  const getTrend = () => {
    if (scores.length < 2) return "neutral"
    const latest = scores[0].score
    const previous = scores[1].score
    if (latest > previous) return "up"
    if (latest < previous) return "down"
    return "neutral"
  }

  const trend = getTrend()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Your Scores
          </h1>
          <p className="text-gray-600">
            Track your progress and watch yourself grow
          </p>
        </div>

        {/* Progress Indicator */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {scores.length}/5
              </span>
              <span className="text-gray-600">scores logged</span>
            </div>

            {/* Trend Indicator */}
            {scores.length >= 2 && (
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
                trend === "up" ? "bg-green-100 text-green-700" :
                trend === "down" ? "bg-red-100 text-red-700" :
                "bg-gray-100 text-gray-700"
              }`}>
                {trend === "up" && <TrendingUp className="w-4 h-4" />}
                {trend === "down" && <TrendingDown className="w-4 h-4" />}
                {trend === "neutral" && <Minus className="w-4 h-4" />}
                <span className="text-sm font-medium">
                  {trend === "up" ? "Trending Up" : trend === "down" ? "Trending Down" : "Steady"}
                </span>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(scores.length / 5) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full"
            />
          </div>
        </motion.div>

        {/* Add Score Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-600" />
            Add New Score
          </h2>

          <form onSubmit={handleAddScore} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="score" className="block text-sm font-medium text-gray-700 mb-2">
                  Score (1-45)
                </label>
                <input
                  id="score"
                  type="number"
                  min="1"
                  max="45"
                  value={newScore}
                  onChange={(e) => setNewScore(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  placeholder="Enter score"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                  Date Played
                </label>
                <input
                  id="date"
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding...
                </span>
              ) : (
                "Add Score"
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg text-center">
            {error}
          </div>
        )}

        {/* Scores List */}
        {!isLoading && !error && scores.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-white rounded-2xl shadow-xl border border-gray-100"
          >
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No scores yet</h3>
            <p className="text-gray-500">Add your first score to start tracking your progress!</p>
          </motion.div>
        )}

        {/* Score Cards */}
        <AnimatePresence mode="popLayout">
          {scores.map((score, index) => (
            <motion.div
              key={score.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
                x: deletingId === score.id ? [0, -10, 10, -10, 10, 0] : 0
              }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-xl p-6 mb-4 border border-gray-100"
            >
              {editingId === score.id ? (
                // Edit Mode
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Score
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="45"
                        value={editScore}
                        onChange={(e) => setEditScore(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date
                      </label>
                      <input
                        type="date"
                        value={editDate}
                        onChange={(e) => setEditDate(e.target.value)}
                        max={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => saveEdit(score.id)}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Save
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={cancelEdit}
                      className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </motion.button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-2xl w-20 h-20 flex items-center justify-center shadow-lg">
                      <div className="text-center">
                        <div className="text-3xl font-bold">{score.score}</div>
                        <div className="text-xs opacity-90">/ 45</div>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-500 mb-1">Played on</div>
                      <div className="text-lg font-semibold text-gray-800">
                        {new Date(score.played_on).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                      {index === 0 && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                          Latest
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => startEdit(score)}
                      className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                      title="Edit score"
                    >
                      <Edit2 className="w-5 h-5" />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(score.id)}
                      className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                      title="Delete score"
                    >
                      <Trash2 className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Score Sparkline */}
        {scores.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-xl p-6 mt-6 border border-gray-100"
          >
            <h3 className="text-lg font-semibold mb-4">Score Trend</h3>
            <div className="h-24 flex items-end justify-between gap-2">
              {scores.slice().reverse().map((score, index) => {
                const percentage = (score.score / 45) * 100
                return (
                  <motion.div
                    key={score.id}
                    initial={{ height: 0 }}
                    animate={{ height: `${percentage}%` }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="flex-1 bg-gradient-to-t from-blue-600 to-purple-600 rounded-t-lg relative group"
                    style={{ minHeight: '20px' }}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {score.score}
                    </div>
                  </motion.div>
                )
              })}
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>Oldest</span>
              <span>Newest</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Toast Notifications */}
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className={`fixed bottom-8 left-1/2 px-6 py-4 rounded-lg shadow-2xl z-50 ${
              toast.type === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            <div className="flex items-center gap-3">
              {toast.type === "success" ? (
                <Check className="w-5 h-5" />
              ) : (
                <X className="w-5 h-5" />
              )}
              <span className="font-medium">{toast.message}</span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
