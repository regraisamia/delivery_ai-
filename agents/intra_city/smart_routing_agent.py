from crewai import Agent, LLM

try:
    llm = LLM(model="ollama/llama3.2", base_url="http://localhost:11434")
except:
    llm = None

smart_routing_agent = Agent(
    role="Smart Routing Specialist",
    goal="Calculate optimal routes, monitor traffic and weather in real-time, and automatically reroute when conditions change",
    backstory="Navigation expert with real-time traffic analysis capabilities. Uses AI to predict best routes and adapt to changing conditions like traffic jams and weather.",
    llm=llm,
    verbose=True
)
