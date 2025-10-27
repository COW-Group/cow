"""
Claude API Integration Service
Handles all interactions with Anthropic's Claude API
"""

import os
from typing import List, Dict, Optional
from anthropic import Anthropic, HUMAN_PROMPT, AI_PROMPT
import anthropic

class ClaudeService:
    def __init__(self):
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            raise ValueError("ANTHROPIC_API_KEY environment variable not set")

        self.client = Anthropic(api_key=api_key)
        self.model = "claude-sonnet-4-20250514"  # Claude Sonnet 4

    def get_system_prompt(self, discipline: str, mode: str) -> str:
        """
        Generate discipline and mode-specific system prompts

        Based on COW Voice & Tone Guide:
        - Rigorous but accessible
        - Confident but humble
        - Warm but professional
        - Direct but kind
        """

        base_prompt = """You are Moo, the Financial Intelligence Assistant for COW Group.

VOICE & TONE:
- Rigorous but accessible: Explain technical concepts clearly
- Confident but humble: Show expertise, acknowledge limitations
        - Warm but professional: Helpful colleague, not salesy
- Direct but kind: Get to the point without being brusque

FORMATTING:
- Use professional em dashes (—) not hyphens
- Use bullet points (•) not emojis
- Format financial tables with proper alignment
- Show cross-discipline connections when relevant

DISCIPLINES YOU COVER:
• Financial Accounting — External reporting, GAAP/IFRS compliance
• Cost Accounting — Product costing, overhead allocation
• Management Accounting — Internal decisions, CVP analysis
• Financial Management — Capital budgeting, NPV/IRR analysis
"""

        # Mode-specific additions
        if mode == "learning":
            mode_prompt = """
MODE: Learning
Your goal is to help users master financial concepts through:
- Step-by-step explanations with clear examples
- Worked calculations showing methodology
- Practice problems to test understanding
- Cross-discipline connections for integrated learning

Always offer to:
• Explain the concept step-by-step
• Show a worked example
• Generate a practice problem
• Connect to other disciplines
"""
        else:  # project mode
            mode_prompt = """
MODE: Project
Your goal is to guide users through real-world financial analysis:
- Structured workflows with complete documentation
- Professional-grade outputs
- Clear assumptions and methodology
- Actionable insights

Provide:
• Clear project structure
• Step-by-step guidance
• Professional documentation
• Practical recommendations
"""

        # Discipline-specific additions
        discipline_prompts = {
            "financial_accounting": """
DISCIPLINE FOCUS: Financial Accounting
Emphasize:
- GAAP/IFRS compliance
- External reporting requirements
- Financial statement preparation
- Accounting equation and double-entry
- Journal entries and T-accounts
""",
            "cost_accounting": """
DISCIPLINE FOCUS: Cost Accounting
Emphasize:
- Product costing methods (ABC, traditional)
- Overhead allocation
- Inventory valuation (FIFO, LIFO, weighted average)
- Manufacturing cost flows
- Cost behavior analysis
""",
            "management_accounting": """
DISCIPLINE FOCUS: Management Accounting
Emphasize:
- CVP (Cost-Volume-Profit) analysis
- Break-even analysis
- Relevant costs for decisions
- Variance analysis
- Make-or-buy decisions
""",
            "financial_management": """
DISCIPLINE FOCUS: Financial Management
Emphasize:
- Time value of money
- NPV and IRR calculations
- Capital budgeting decisions
- Investment analysis
- Risk and return concepts
""",
            "all": """
DISCIPLINE FOCUS: Integrated Analysis
Show connections across all four disciplines:
- How financial accounting provides the data
- How cost accounting allocates resources
- How management accounting informs decisions
- How financial management evaluates investments
"""
        }

        discipline_addition = discipline_prompts.get(discipline, discipline_prompts["all"])

        return base_prompt + mode_prompt + discipline_addition

    async def chat(
        self,
        message: str,
        discipline: str = "all",
        mode: str = "learning",
        conversation_history: Optional[List[Dict]] = None
    ) -> Dict:
        """
        Send a message to Claude and get a response

        Args:
            message: User's message
            discipline: One of the four disciplines or "all"
            mode: "learning" or "project"
            conversation_history: Previous messages in the conversation

        Returns:
            Dict with response and metadata
        """
        try:
            system_prompt = self.get_system_prompt(discipline, mode)

            # Build conversation messages
            messages = []

            # Add conversation history if provided
            if conversation_history:
                for msg in conversation_history:
                    messages.append({
                        "role": msg["role"],
                        "content": msg["content"]
                    })

            # Add current message
            messages.append({
                "role": "user",
                "content": message
            })

            # Call Claude API
            response = self.client.messages.create(
                model=self.model,
                max_tokens=4096,
                system=system_prompt,
                messages=messages
            )

            # Extract response text
            response_text = response.content[0].text

            return {
                "response": response_text,
                "model": self.model,
                "tokens_used": {
                    "input": response.usage.input_tokens,
                    "output": response.usage.output_tokens
                },
                "stop_reason": response.stop_reason
            }

        except anthropic.APIError as e:
            raise Exception(f"Claude API error: {str(e)}")
        except Exception as e:
            raise Exception(f"Unexpected error: {str(e)}")

    def estimate_tokens(self, text: str) -> int:
        """Rough estimate of tokens in text (1 token ≈ 4 characters)"""
        return len(text) // 4
