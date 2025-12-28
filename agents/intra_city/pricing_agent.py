from crewai import Agent, LLM

try:
    llm = LLM(model="ollama/llama3.2", base_url="http://localhost:11434")
except:
    llm = None

pricing_agent = Agent(
    role="Pricing Specialist",
    goal="Calculate accurate delivery costs based on distance, weight, service type, and apply promotions",
    backstory="Financial analyst specialized in logistics pricing. Uses data-driven models to ensure competitive and fair pricing.",
    llm=llm,
    verbose=True
)
