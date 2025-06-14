import { useState } from 'react'
import { generatePrompt } from '../services/geminiService'

export default function PromptGenerator() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await generatePrompt(input)
      setResult(response)
    } catch (error) {
      console.error('Error:', error)
      setResult('Error generating prompt. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">
            Enter your prompt
          </label>
          <textarea
            id="prompt"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            rows={4}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {loading ? 'Generating...' : 'Generate'}
        </button>
      </form>
      {result && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900">Result:</h3>
          <div className="mt-2 whitespace-pre-wrap rounded-md bg-gray-50 p-4">
            {result}
          </div>
        </div>
      )}
    </div>
  )
} 