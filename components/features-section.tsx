import { Bot, Brain, Clock, Headphones, MessageSquare, Sparkles } from "lucide-react"

const features = [
  {
    icon: <Bot className="h-10 w-10 text-primary" />,
    title: "Multi-Agent Creation",
    description: "Create multiple AI agents with unique personalities, voices, and knowledge bases.",
  },
  {
    icon: <Headphones className="h-10 w-10 text-primary" />,
    title: "Voice Conversations",
    description: "Have natural voice interactions with configurable session durations based on your plan.",
  },
  {
    icon: <Brain className="h-10 w-10 text-primary" />,
    title: "Long-Term Memory",
    description: "Agents remember past conversations using advanced vector embeddings technology.",
  },
  {
    icon: <MessageSquare className="h-10 w-10 text-primary" />,
    title: "Conversation Analytics",
    description: "Get post-session analysis with sentiment detection and key insights extraction.",
  },
  {
    icon: <Clock className="h-10 w-10 text-primary" />,
    title: "Session-Based Limits",
    description: "Control conversation durations with flexible session-based time limits.",
  },
  {
    icon: <Sparkles className="h-10 w-10 text-primary" />,
    title: "Customizable Personalities",
    description: "Fine-tune your agent's personality, tone, and behavior to suit your preferences.",
  },
]

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-muted/50">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Powerful AI Voice Features</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Create, customize, and converse with AI agents that remember your interactions and adapt to your needs.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-background rounded-lg p-6 shadow-sm border">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
