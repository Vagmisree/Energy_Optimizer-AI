'use client'

import { useState, useRef, useEffect } from 'react'
import { Mic, MicOff, Volume2, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface VoiceQuery {
  query: string
  timestamp: Date
  response?: string
  isProcessing?: boolean
}

// Format time consistently to avoid hydration mismatch
function formatTime(date: Date): string {
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const ampm = hours >= 12 ? 'PM' : 'AM'
  const formattedHours = hours % 12 || 12
  const formattedMinutes = minutes.toString().padStart(2, '0')
  return `${formattedHours}:${formattedMinutes} ${ampm}`
}

export function VoiceAIAssistant() {
  const [mounted, setMounted] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [queries, setQueries] = useState<VoiceQuery[]>([])
  const [transcript, setTranscript] = useState('')
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  const mockVoiceResponses: { [key: string]: string } = {
    'how much': 'Your estimated monthly bill is ₹3,500. Peak hour usage is adding ₹1,200 to your bill.',
    'ac': 'Your AC usage is the highest contributor to your bill at 35%. Reducing usage by 2 hours daily could save ₹600 monthly.',
    'save': 'You can save up to 25% by shifting loads to off-peak hours and reducing AC usage during peak times.',
    'peak': 'Peak hours are from 6 PM to 10 PM. Your usage during this time is 45% higher than average.',
    'default': 'Based on your energy patterns, I recommend reducing AC usage and shifting heavy appliance loads to early morning hours.',
  }

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      audioContextRef.current = audioContext

      const analyser = audioContext.createAnalyser()
      analyserRef.current = analyser

      const source = audioContext.createMediaStreamSource(stream)
      source.connect(analyser)

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      let audioChunks: Blob[] = []

      mediaRecorder.ondataavailable = event => {
        audioChunks.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' })
        // In production, send to backend speech-to-text service
        const mockTranscript = 'How can I reduce my energy bill'
        handleVoiceQuery(mockTranscript)
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsListening(true)
      setTranscript('Listening...')
    } catch (error) {
      console.error('Error accessing microphone:', error)
    }
  }

  const stopListening = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      setIsListening(false)
    }
  }

  const handleVoiceQuery = (query: string) => {
    setTranscript(query)

    // Simulate AI response
    const response = Object.entries(mockVoiceResponses).find(([key]) =>
      query.toLowerCase().includes(key)
    )?.[1] || mockVoiceResponses.default

    const newQuery: VoiceQuery = {
      query,
      timestamp: new Date(),
      response,
      isProcessing: false,
    }

    setQueries([newQuery, ...queries])
    setTranscript('')
  }

  return (
    <div className="glass rounded-2xl p-6 space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Voice AI Assistant</h3>
        <p className="text-sm text-muted-foreground mt-1">Ask questions about your energy usage</p>
      </div>

      {/* Voice Input */}
      <div className="p-6 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 space-y-4">
        <div className="flex flex-col items-center gap-4">
          <div className={cn(
            'w-20 h-20 rounded-full flex items-center justify-center transition-all',
            isListening ? 'bg-red-500 animate-pulse' : 'bg-primary'
          )}>
            {isListening ? (
              <MicOff className="w-10 h-10 text-white" />
            ) : (
              <Mic className="w-10 h-10 text-white" />
            )}
          </div>

          <div className="text-center">
            <p className="font-medium text-foreground">
              {isListening ? 'Recording...' : transcript || 'Click to start speaking'}
            </p>
            {isListening && (
              <p className="text-sm text-muted-foreground mt-1">Listening for your question...</p>
            )}
          </div>

          <div className="flex gap-2">
            {isListening ? (
              <Button onClick={stopListening} variant="destructive">
                Stop Recording
              </Button>
            ) : (
              <Button onClick={startListening}>
                <Mic className="w-4 h-4 mr-2" />
                Start Speaking
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Query History */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {queries.map((q, idx) => (
          <div key={idx} className="p-4 rounded-lg border border-border bg-card space-y-3">
            {/* User Query */}
            <div className="flex items-start gap-3">
              <Volume2 className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{q.query}</p>
                <p className="text-xs text-muted-foreground mt-1" suppressHydrationWarning>
                  {mounted ? formatTime(q.timestamp) : ''}
                </p>
              </div>
            </div>

            {/* AI Response */}
            {q.response && (
              <div className="pl-7 p-3 rounded-lg bg-accent/10 border border-accent/30">
                <p className="text-sm text-foreground">{q.response}</p>
                <Button size="sm" variant="ghost" className="mt-2 h-8">
                  Get Details →
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Sample Questions */}
      {queries.length === 0 && (
        <div className="p-4 rounded-lg bg-muted/50 space-y-3">
          <p className="text-sm font-medium text-foreground">Try asking:</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              'How much is my bill?',
              'How to reduce AC cost?',
              'What are peak hours?',
              'Show my savings potential',
            ].map(question => (
              <button
                key={question}
                onClick={() => handleVoiceQuery(question)}
                className="text-left text-xs p-2 rounded bg-card border border-border hover:border-primary/50 transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Text-based Voice Query Alternative
export function TextVoiceQuery() {
  const [query, setQuery] = useState('')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    if (!query.trim()) return

    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      const mockResponses: { [key: string]: string } = {
        'bill': 'Your current estimated bill is ₹3,500 for this month.',
        'save': 'You can save 20-30% by optimizing your AC usage and shifting loads to off-peak hours.',
        'peak': 'Peak hours are 6PM-10PM when electricity rates are 60% higher.',
        'default': 'Based on your usage pattern, I recommend reviewing your appliance settings.',
      }

      const key = Object.keys(mockResponses).find(k => query.toLowerCase().includes(k)) || 'default'
      setResponse(mockResponses[key])
      setIsLoading(false)
    }, 1000)
  }

  return (
    <Card className="glass p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Ask AI About Your Energy</h3>

      <div className="space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Ask anything about your energy usage..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            className="flex-1 px-4 py-2 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button onClick={handleSubmit} disabled={isLoading} size="sm">
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {response && (
          <div className="p-4 rounded-lg bg-accent/10 border border-accent/30">
            <p className="text-sm text-foreground">{response}</p>
          </div>
        )}
      </div>
    </Card>
  )
}
