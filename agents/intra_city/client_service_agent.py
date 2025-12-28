from crewai import Agent, LLM

try:
    from crewai import Agent
    from litellm import LLM
except ImportError:
    from crewai import Agent, LLM

try:
    llm = "ollama/llama3.1"  # Use string for compatibility
except:
    llm = None

client_service_agent = Agent(
    role="Client Service Specialist",
    goal="Handle customer interactions, validate orders, and send notifications throughout the delivery process",
    backstory="Customer service expert with deep knowledge of delivery operations. Ensures customers are informed and satisfied at every step.",
    llm=llm,
    verbose=True
)
