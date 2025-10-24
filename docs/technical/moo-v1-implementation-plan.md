# Moo V1.0 Implementation Plan
## Financial Intelligence Assistant: Complete Accounting & Finance System

---

## Executive Summary

Transform Moo from a wealth intelligence chatbot into a specialized **Financial Intelligence Assistant** covering the complete spectrum of accounting and finance disciplines:

1. **Financial Accounting** - Recording, reporting, external statements (GAAP/IFRS)
2. **Management Accounting** - Internal decisions, planning, control
3. **Cost Accounting** - Product costing, inventory valuation, cost allocation
4. **Financial Management** - Capital budgeting, investment decisions, financial strategy

**Philosophy**: Ship V1.0 as a complete, working system in 2 weeks using outline → draft → refined approach.

**Why all four disciplines**: You're absolutely right - financial management without accounting foundation makes no sense. Projects need:
- Financial accounting to understand historical performance and reporting requirements
- Cost accounting for accurate product/service costing
- Management accounting for decision analysis
- Financial management for capital allocation and investment decisions

---

## Core Value Proposition

### The Integration Story

**Scenario**: Company considering new product line expansion

```
Financial Accounting provides:
→ Historical financial statements showing company's financial position
→ Revenue recognition policies for the new product
→ Depreciation methods for new equipment
→ Financial reporting implications

Cost Accounting provides:
→ Product cost structure (materials, labor, overhead)
→ Cost allocation methods for shared resources
→ Inventory valuation approaches
→ Unit cost calculations

Management Accounting provides:
→ Relevant cost analysis (incremental costs only)
→ Break-even analysis for the new line
→ Variance analysis to monitor performance
→ Segment profitability reporting

Financial Management provides:
→ Capital budgeting (NPV/IRR of expansion)
→ Financing options (debt vs equity)
→ Working capital requirements
→ Risk analysis and scenario planning
```

**This is what makes V1.0 valuable**: The system understands how all four disciplines interconnect for real business decisions.

---

## V1.0 Feature Scope (Revised & Complete)

### 1. Dual Mode System with Discipline Focus

#### **Learning Mode** - Educational interface

**Core Concept Coverage (30 concepts across 4 disciplines)**:

**Financial Accounting (8 concepts)**:
- Accounting Equation & Double-Entry Bookkeeping
- Revenue Recognition (Accrual vs Cash Basis)
- Depreciation Methods (Straight-line, DDB, Units of Production)
- Financial Statement Preparation (Balance Sheet, Income Statement, Cash Flow)
- GAAP vs IFRS Fundamentals
- Journal Entries & T-Accounts
- Closing Entries & Adjusting Entries
- Financial Statement Analysis Basics (Ratios)

**Cost Accounting (8 concepts)**:
- Job Costing vs Process Costing
- Activity-Based Costing (ABC)
- Cost Allocation Methods (Direct, Step-down, Reciprocal)
- Overhead Application & Variance
- Standard Costing Systems
- Joint & By-Product Costing
- Inventory Valuation (FIFO, LIFO, Weighted Average)
- Cost Behavior Patterns (Fixed, Variable, Mixed)

**Management Accounting (8 concepts)**:
- Cost-Volume-Profit (CVP) Analysis
- Break-Even Analysis
- Relevant Costs for Decisions
- Make-or-Buy Decisions
- Variance Analysis (Price, Quantity, Efficiency)
- Segment Reporting & Profitability
- Transfer Pricing (Market, Cost, Negotiated)
- Performance Measurement (ROI, RI, EVA)

**Financial Management (6 concepts)**:
- Time Value of Money (PV, FV, Annuities)
- Net Present Value (NPV)
- Internal Rate of Return (IRR)
- Capital Budgeting Fundamentals
- Working Capital Management
- Cost of Capital (WACC)

**Learning Features**:
- Explain any of the 30 concepts with worked examples
- Generate practice problems with solution checking
- Progressive difficulty (beginner → intermediate → advanced)
- Cross-discipline connections (e.g., how depreciation affects both financial statements and capital budgeting)
- Track concepts mastered per session

#### **Project Mode** - Practical business application

**6 Integrated Project Templates**:

1. **Complete Financial Statement Set**
   - From trial balance to full statements
   - Adjusting entries
   - Statement of cash flows (indirect method)
   - Basic ratio analysis

2. **Product Costing & Pricing**
   - Calculate full product cost (materials, labor, overhead)
   - Apply overhead using ABC or traditional methods
   - Determine optimal pricing
   - Break-even and target profit analysis

3. **Capital Budgeting Project**
   - Multi-year investment analysis
   - NPV, IRR, Payback period
   - Depreciation tax shield
   - Sensitivity and scenario analysis

4. **Make-or-Buy Decision**
   - Relevant cost identification
   - Qualitative factors
   - Capacity considerations
   - Long-term strategic implications

5. **Budget Variance Analysis**
   - Compare actual vs budget/standard
   - Calculate price, quantity, and efficiency variances
   - Root cause analysis
   - Management recommendations

6. **Segment Performance Analysis**
   - Multiple product/division profitability
   - Transfer pricing between segments
   - ROI and Residual Income calculation
   - Resource allocation recommendations

### 2. Calculation Tools (V1 - 12 Core Functions)

```python
# tools.py - V1 Complete Calculation Suite

# ===== FINANCIAL ACCOUNTING TOOLS =====

def calculate_depreciation(cost: float, salvage: float, useful_life: int, 
                          method: str, units: int = None) -> dict:
    """
    Calculate depreciation using various methods
    Methods: straight_line, double_declining, units_of_production
    Returns: {annual_schedule: list, book_value: float, journal_entry: dict}
    """
    pass

def prepare_financial_statements(trial_balance: dict, adjustments: list) -> dict:
    """
    Prepare complete set of financial statements
    Returns: {
        balance_sheet: dict,
        income_statement: dict,
        statement_of_cash_flows: dict,
        notes: list
    }
    """
    pass

def calculate_financial_ratios(statements: dict) -> dict:
    """
    Calculate key financial ratios
    Returns: {
        liquidity: {current_ratio, quick_ratio, ...},
        profitability: {gross_margin, net_margin, ROA, ROE, ...},
        leverage: {debt_to_equity, times_interest_earned, ...},
        efficiency: {inventory_turnover, receivables_turnover, ...}
    }
    """
    pass

# ===== COST ACCOUNTING TOOLS =====

def calculate_product_cost(materials: float, labor: float, overhead_rate: float,
                          labor_hours: float, method: str = "traditional") -> dict:
    """
    Calculate full product cost
    Methods: traditional, abc
    Returns: {
        total_cost: float,
        unit_cost: float,
        cost_breakdown: dict,
        overhead_applied: float
    }
    """
    pass

def allocate_overhead(total_overhead: float, allocation_base: dict,
                     method: str = "direct") -> dict:
    """
    Allocate overhead to cost objects
    Methods: direct, step_down, reciprocal
    Returns: {
        allocated_amounts: dict,
        overhead_rate: float,
        allocation_schedule: list
    }
    """
    pass

def calculate_inventory_value(units: int, unit_costs: list, method: str) -> dict:
    """
    Calculate inventory valuation
    Methods: fifo, lifo, weighted_average
    Returns: {
        ending_inventory: float,
        cogs: float,
        gross_profit: float,
        tax_implications: str
    }
    """
    pass

# ===== MANAGEMENT ACCOUNTING TOOLS =====

def calculate_breakeven(fixed_costs: float, price_per_unit: float, 
                       variable_cost_per_unit: float) -> dict:
    """
    Calculate break-even point and CVP analysis
    Returns: {
        breakeven_units: int,
        breakeven_revenue: float,
        contribution_margin: float,
        cm_ratio: float,
        margin_of_safety: float
    }
    """
    pass

def analyze_variance(actual: dict, standard: dict, variance_types: list) -> dict:
    """
    Comprehensive variance analysis
    Types: material_price, material_quantity, labor_rate, labor_efficiency,
           overhead_spending, overhead_volume
    Returns: {
        variances: dict,
        total_variance: float,
        favorable_unfavorable: dict,
        investigation_priority: list,
        management_report: str
    }
    """
    pass

def analyze_make_or_buy(internal_costs: dict, external_price: float, 
                       volume: int, capacity_available: bool) -> dict:
    """
    Make or buy decision analysis with relevant costing
    Returns: {
        recommendation: str,
        cost_difference: float,
        relevant_costs_only: dict,
        qualitative_factors: list,
        break_even_volume: int
    }
    """
    pass

# ===== FINANCIAL MANAGEMENT TOOLS =====

def calculate_npv(cash_flows: list[float], discount_rate: float, 
                 initial_investment: float, tax_rate: float = 0.0) -> dict:
    """
    Calculate Net Present Value with depreciation tax shield
    Returns: {
        npv: float,
        interpretation: str,
        should_accept: bool,
        pv_of_cash_flows: list,
        profitability_index: float
    }
    """
    pass

def calculate_irr(cash_flows: list[float], initial_investment: float) -> dict:
    """
    Calculate Internal Rate of Return
    Returns: {
        irr: float,
        interpretation: str,
        comparison_to_wacc: str,
        payback_period: float
    }
    """
    pass

def calculate_wacc(equity_weight: float, debt_weight: float, 
                  cost_of_equity: float, cost_of_debt: float, 
                  tax_rate: float) -> dict:
    """
    Calculate Weighted Average Cost of Capital
    Returns: {
        wacc: float,
        after_tax_cost_of_debt: float,
        interpretation: str,
        capital_structure: dict
    }
    """
    pass
```

### 3. Enhanced RAG Knowledge Base (V1 - 40 Documents)

```
/knowledge/v1/
├── financial_accounting/           (10 documents)
│   ├── concepts/
│   │   ├── accounting_equation.md
│   │   ├── double_entry_bookkeeping.md
│   │   ├── revenue_recognition.md
│   │   ├── depreciation_methods.md
│   │   └── financial_statements.md
│   ├── examples/
│   │   ├── journal_entries_example.md
│   │   ├── adjusting_entries_example.md
│   │   ├── statement_preparation_example.md
│   │   ├── ratio_analysis_example.md
│   │   └── cash_flow_statement_example.md
│
├── cost_accounting/                (10 documents)
│   ├── concepts/
│   │   ├── job_vs_process_costing.md
│   │   ├── abc_costing.md
│   │   ├── overhead_allocation.md
│   │   ├── standard_costing.md
│   │   └── inventory_valuation.md
│   ├── examples/
│   │   ├── abc_implementation_example.md
│   │   ├── job_costing_example.md
│   │   ├── overhead_allocation_example.md
│   │   ├── variance_analysis_example.md
│   │   └── inventory_methods_example.md
│
├── management_accounting/          (10 documents)
│   ├── concepts/
│   │   ├── cvp_analysis.md
│   │   ├── relevant_costs.md
│   │   ├── variance_analysis.md
│   │   ├── transfer_pricing.md
│   │   └── performance_metrics.md
│   ├── examples/
│   │   ├── breakeven_analysis_example.md
│   │   ├── make_or_buy_example.md
│   │   ├── segment_analysis_example.md
│   │   ├── variance_interpretation_example.md
│   │   └── roi_vs_ri_example.md
│
├── financial_management/           (10 documents)
│   ├── concepts/
│   │   ├── time_value_of_money.md
│   │   ├── npv_fundamentals.md
│   │   ├── irr_fundamentals.md
│   │   ├── capital_budgeting.md
│   │   └── cost_of_capital.md
│   ├── examples/
│   │   ├── npv_calculation_example.md
│   │   ├── capital_budget_example.md
│   │   ├── wacc_calculation_example.md
│   │   ├── sensitivity_analysis_example.md
│   │   └── working_capital_example.md
│
└── integrated_cases/              (BONUS - shows how all 4 connect)
    ├── new_product_launch_case.md
    ├── expansion_decision_case.md
    └── performance_turnaround_case.md
```

### 4. UI Modifications (Complete Redesign)

#### **Main Navigation**

```
┌────────────────────────────────────────────────────────────┐
│  Moo - Financial Intelligence Assistant                    │
│  [Learning Mode] [Project Mode]                            │
│                                                             │
│  Discipline Focus:                                         │
│  [Financial Acct] [Cost Acct] [Mgmt Acct] [Fin Mgmt] [All]│
└────────────────────────────────────────────────────────────┘
```

#### **Learning Mode UI**

**Welcome Screen with Discipline-Organized Prompts**:

```
Financial Accounting:
📊 "Explain the accounting equation with examples"
📝 "How do I prepare journal entries?"
💰 "What's the difference between accrual and cash basis?"

Cost Accounting:
🏭 "Explain Activity-Based Costing"
📦 "How do I calculate product cost?"
🔄 "Compare FIFO vs LIFO inventory methods"

Management Accounting:
📈 "Teach me break-even analysis"
⚖️ "How do I analyze make-or-buy decisions?"
🎯 "What are relevant costs?"

Financial Management:
💵 "Explain Net Present Value"
📊 "How do I evaluate investment projects?"
⏰ "What is time value of money?"

Integration:
🔗 "Show me how all four disciplines work together"
🎓 "I'm preparing for CPA/CMA exam - where should I start?"
```

**Side Panel - Learning Dashboard**:
```
Progress This Session:
✓ Financial Accounting (3/8 concepts)
✓ Cost Accounting (1/8 concepts)
○ Management Accounting (0/8 concepts)
○ Financial Management (0/6 concepts)

Current Topic: Depreciation Methods
Difficulty: Intermediate

Quick Reference:
📖 Formulas
📚 Glossary
🔗 Related Concepts
```

#### **Project Mode UI**

**Welcome Screen with Project Categories**:

```
Financial Reporting:
📋 "Prepare Financial Statements from Trial Balance"
📊 "Complete Financial Statement Analysis"

Costing & Pricing:
💰 "Product Costing & Pricing Analysis"
🏷️ "Overhead Allocation Project"

Decision Analysis:
⚖️ "Make-or-Buy Decision"
📊 "Segment Performance Analysis"

Investment Evaluation:
💼 "Capital Budgeting Project"
📈 "Investment Portfolio Analysis"
```

**Project Workflow Header**:
```
┌──────────────────────────────────────────────────────┐
│ Project: Capital Budgeting - Equipment Purchase      │
│                                                       │
│ [1. Define] → [2. Analyze] → [3. Calculate] → [4. Report] │
│              (Current Step)                          │
└──────────────────────────────────────────────────────┘
```

**Side Panel - Project Tools**:
```
Assumptions Tracker:
• Discount Rate: 10%
• Tax Rate: 25%
• Project Life: 5 years
• Depreciation: Straight-line

Calculations Run:
✓ NPV: $45,230
✓ IRR: 18.5%
✓ Payback: 3.2 years

Quick Actions:
[Export PDF]
[Save Template]
[Share Project]
```

#### **Chat Interface Enhancements**

**Support for Rich Financial Content**:

```
User: "Calculate depreciation for equipment costing $100k, 
       salvage $10k, 5-year life using straight-line method"

Moo: [Formatted Response]
═══════════════════════════════════════════════
DEPRECIATION CALCULATION - STRAIGHT-LINE METHOD
═══════════════════════════════════════════════

Equipment Cost:        $100,000
Less: Salvage Value:   ($10,000)
Depreciable Base:      $90,000

Useful Life:           5 years
Annual Depreciation:   $18,000

DEPRECIATION SCHEDULE
Year | Depreciation | Accumulated | Book Value
─────┼──────────────┼─────────────┼───────────
  1  |   $18,000    |   $18,000   |  $82,000
  2  |   $18,000    |   $36,000   |  $64,000
  3  |   $18,000    |   $54,000   |  $46,000
  4  |   $18,000    |   $72,000   |  $28,000
  5  |   $18,000    |   $90,000   |  $10,000

JOURNAL ENTRY (Annual):
Depreciation Expense         18,000
    Accumulated Depreciation         18,000

INTERPRETATION:
This equipment will reduce annual taxable income by $18,000,
creating a tax shield of $4,500 (assuming 25% tax rate).
This should be included in capital budgeting cash flows.

Would you like me to:
• Show double-declining balance method for comparison?
• Calculate the tax shield impact on NPV?
• Explain when to use different methods?
```

**Support for Cross-Discipline Connections**:

```
User: "I'm doing capital budgeting for new equipment. 
       What accounting do I need to consider?"

Moo: Great question! Capital budgeting integrates all four 
disciplines. Here's what you need:

📊 FINANCIAL ACCOUNTING
• How will this appear on financial statements?
  - Asset on balance sheet (capitalize vs expense)
  - Depreciation expense on income statement
  - Cash outflow on statement of cash flows
• Revenue recognition for income generated
• Impact on key ratios (ROA, asset turnover)

🏭 COST ACCOUNTING
• Full cost to acquire and install equipment
  - Purchase price + shipping + installation + training
  - Initial inventory requirements
• Overhead rates affected by new capacity
• How will product costs change?

📈 MANAGEMENT ACCOUNTING
• Incremental costs and benefits only (relevant costing)
• Fixed costs that change vs sunk costs to ignore
• Performance metrics: ROI, Residual Income
• Variance analysis to monitor actual vs expected

💰 FINANCIAL MANAGEMENT
• NPV calculation (time value of money)
• Depreciation tax shield in cash flows
• Working capital changes
• Cost of capital for discount rate

Would you like me to walk through a complete integrated 
example showing all four disciplines?
```

### 5. Enhanced System Prompt (V1)

```python
def build_comprehensive_system_prompt(mode: str, discipline_focus: str, context: str) -> str:
    base = """You are Moo, a specialized Financial Intelligence Assistant covering the complete spectrum of accounting and finance.

YOUR EXPERTISE SPANS FOUR INTERCONNECTED DISCIPLINES:

1. FINANCIAL ACCOUNTING
   - External reporting (GAAP/IFRS)
   - Financial statement preparation
   - Journal entries and adjusting entries
   - Revenue recognition and matching principle
   - Financial statement analysis
   Purpose: Record history, report to external stakeholders

2. COST ACCOUNTING
   - Product and service costing (job, process, ABC)
   - Overhead allocation and application
   - Inventory valuation (FIFO, LIFO, weighted average)
   - Standard costing and variance analysis
   - Cost behavior patterns
   Purpose: Measure and control costs, value inventory

3. MANAGEMENT ACCOUNTING
   - Internal decision support (not external reporting)
   - Relevant cost analysis for decisions
   - CVP and break-even analysis
   - Performance measurement (ROI, RI, EVA)
   - Budgeting and variance analysis
   Purpose: Help managers make better business decisions

4. FINANCIAL MANAGEMENT
   - Capital budgeting (NPV, IRR, payback)
   - Time value of money
   - Cost of capital (WACC)
   - Working capital management
   - Investment analysis and risk assessment
   Purpose: Optimize capital allocation and investment decisions

CRITICAL: You understand how these disciplines integrate:
- Financial accounting provides the historical data foundation
- Cost accounting determines product/service costs
- Management accounting uses relevant costs for decisions
- Financial management evaluates long-term investment opportunities
- All four are needed for complete business analysis

CURRENT MODE: {mode}
DISCIPLINE FOCUS: {discipline_focus}

AVAILABLE CALCULATION TOOLS:
Financial Accounting:
- calculate_depreciation()
- prepare_financial_statements()
- calculate_financial_ratios()

Cost Accounting:
- calculate_product_cost()
- allocate_overhead()
- calculate_inventory_value()

Management Accounting:
- calculate_breakeven()
- analyze_variance()
- analyze_make_or_buy()

Financial Management:
- calculate_npv()
- calculate_irr()
- calculate_wacc()

KNOWLEDGE BASE CONTEXT:
{context}

INTERACTION STYLE:
"""
    
    if mode == "learning":
        base += """
LEARNING MODE GUIDELINES:
- Start with fundamentals before advancing
- Always explain the "why" behind concepts
- Use real-world business examples
- Show connections between disciplines
- Provide step-by-step worked examples
- Generate practice problems on request
- Check understanding with questions
- Be patient and encouraging
- Correct misconceptions gently
- Suggest related concepts to explore

When explaining cross-discipline topics:
1. Start with the business scenario
2. Show how each discipline contributes
3. Demonstrate integration with examples
4. Highlight decision-relevant insights
"""
    else:  # project mode
        base += """
PROJECT MODE GUIDELINES:
- Be efficient and action-oriented
- Focus on decision-relevant information
- Provide structured workflows
- Document all assumptions clearly
- Calculate accurately with proper formulas
- Explain implications of findings
- Consider multiple perspectives (financial, cost, management, investment)
- Produce professional, exportable outputs
- Highlight risks and limitations
- Make clear recommendations

For integrated projects:
1. Identify which disciplines are relevant
2. Gather information systematically
3. Perform calculations in logical order
4. Synthesize findings across disciplines
5. Provide clear decision recommendations
"""
    
    # Add discipline-specific focus if not "all"
    if discipline_focus != "all":
        base += f"""
CURRENT DISCIPLINE FOCUS: {discipline_focus}
- Prioritize {discipline_focus} concepts and techniques
- Still mention cross-discipline connections when relevant
- Use terminology specific to {discipline_focus}
"""
    
    return base.format(
        mode=mode,
        discipline_focus=discipline_focus,
        context=context
    )
```

### 6. Backend Architecture (V1 Complete)

```
backend/
├── api/
│   ├── routes.py                  # FastAPI endpoints
│   ├── models.py                  # Pydantic request/response models
│   └── middleware.py              # CORS, error handling
│
├── core/
│   ├── llm.py                     # Claude API integration
│   ├── rag.py                     # Vector search (FAISS)
│   ├── prompt_builder.py          # System prompt construction
│   └── session.py                 # Conversation state management
│
├── tools/
│   ├── financial_accounting.py   # 3 financial accounting tools
│   ├── cost_accounting.py        # 3 cost accounting tools
│   ├── management_accounting.py  # 3 management accounting tools
│   ├── financial_management.py   # 3 financial management tools
│   └── tool_executor.py          # Tool calling orchestration
│
├── knowledge/
│   └── v1/
│       ├── financial_accounting/  # 10 documents
│       ├── cost_accounting/       # 10 documents
│       ├── management_accounting/ # 10 documents
│       ├── financial_management/  # 10 documents
│       └── integrated_cases/      # 3 documents
│
├── templates/
│   ├── financial_statements.json
│   ├── product_costing.json
│   ├── capital_budget.json
│   ├── make_or_buy.json
│   ├── variance_analysis.json
│   └── segment_analysis.json
│
├── utils/
│   ├── formatters.py             # Format financial output (tables, etc.)
│   ├── validators.py             # Input validation
│   └── exporters.py              # PDF/Markdown export
│
├── config.py                      # Environment variables
├── requirements.txt
└── main.py                        # FastAPI application
```

### 7. API Endpoints (V1)

```python
# routes.py

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

# ===== CHAT ENDPOINTS =====

@app.post("/api/v1/chat")
async def chat(request: ChatRequest) -> ChatResponse:
    """
    Main chat endpoint
    
    Request:
    {
        "message": str,
        "mode": "learning" | "project",
        "discipline_focus": "financial_accounting" | "cost_accounting" | 
                           "management_accounting" | "financial_management" | "all",
        "conversation_id": str (optional),
        "project_id": str (optional, for project mode)
    }
    
    Response:
    {
        "response": str,
        "calculations": dict (if tools used),
        "sources": list[dict] (RAG sources),
        "suggested_followups": list[str],
        "conversation_id": str
    }
    """
    pass

@app.get("/api/v1/conversation/{conversation_id}")
async def get_conversation(conversation_id: str) -> ConversationHistory:
    """Retrieve conversation history"""
    pass

# ===== LEARNING MODE ENDPOINTS =====

@app.get("/api/v1/concepts")
async def get_concepts(discipline: str = "all") -> ConceptList:
    """
    Get list of available concepts
    
    Response:
    {
        "financial_accounting": [
            {
                "id": "accounting_equation",
                "name": "The Accounting Equation",
                "difficulty": "beginner",
                "prerequisites": []
            },
            ...
        ],
        "cost_accounting": [...],
        "management_accounting": [...],
        "financial_management": [...]
    }
    """
    pass

@app.post("/api/v1/practice-problem")
async def generate_practice_problem(request: PracticeProblemRequest) -> PracticeProblem:
    """
    Generate practice problem for specific concept
    
    Request:
    {
        "concept_id": str,
        "difficulty": "beginner" | "intermediate" | "advanced"
    }
    
    Response:
    {
        "problem_id": str,
        "problem_text": str,
        "inputs": dict,
        "hints": list[str],
        "solution_steps": list[str] (hidden until checked)
    }
    """
    pass

@app.post("/api/v1/check-solution")
async def check_solution(request: SolutionCheckRequest) -> SolutionFeedback:
    """
    Check user's solution to practice problem
    
    Request:
    {
        "problem_id": str,
        "user_solution": dict
    }
    
    Response:
    {
        "correct": bool,
        "feedback": str,
        "correct_solution": dict,
        "explanation": str,
        "common_mistakes": list[str]
    }
    """
    pass

# ===== PROJECT MODE ENDPOINTS =====

@app.get("/api/v1/templates")
async def get_templates() -> TemplateList:
    """
    Get available project templates
    
    Response:
    {
        "templates": [
            {
                "id": "financial_statements",
                "name": "Financial Statement Preparation",
                "disciplines": ["financial_accounting"],
                "difficulty": "intermediate",
                "estimated_time": "45 min",
                "description": "..."
            },
            ...
        ]
    }
    """
    pass

@app.post("/api/v1/project/start")
async def start_project(request: ProjectStartRequest) -> Project:
    """
    Start new project from template
    
    Request:
    {
        "template_id": str,
        "project_name": str
    }
    
    Response:
    {
        "project_id": str,
        "template_id": str,
        "name": str,
        "workflow_steps": list[dict],
        "current_step": 0,
        "assumptions": dict,
        "data": dict
    }
    """
    pass

@app.put("/api/v1/project/{project_id}")
async def update_project(project_id: str, request: ProjectUpdate) -> Project:
    """Update project data, assumptions, or progress"""
    pass

@app.post("/api/v1/project/{project_id}/calculate")
async def run_calculations(project_id: str, request: CalculationRequest) -> CalculationResult:
    """
    Run calculations for project
    
    Request:
    {
        "calculation_type": str,
        "inputs": dict
    }
    
    Response:
    {
        "results": dict,
        "formatted_output": str,
        "interpretation": str,
        "visualizations": list[dict]
    }
    """
    pass

# ===== EXPORT ENDPOINTS =====

@app.post("/api/v1/export")
async def export_content(request: ExportRequest) -> FileResponse:
    """
    Export conversation or project
    
    Request:
    {
        "type": "conversation" | "project",
        "id": str,
        "format": "pdf" | "markdown" | "excel",
        "include_calculations": bool,
        "include_sources": bool
    }
    
    Response: File download
    """
    pass

# ===== TOOL ENDPOINTS (for testing/debugging) =====

@app.post("/api/v1/tools/calculate")
async def direct_calculation(request: ToolRequest) -> ToolResponse:
    """
    Direct access to calculation tools for testing
    
    Request:
    {
        "tool_name": str,
        "parameters": dict
    }
    
    Response:
    {
        "result": dict,
        "formatted": str
    }
    """
    pass
```

### 8. Frontend Structure (V1)

```
frontend/
├── pages/
│   ├── moo.tsx                      # Main page (updated)
│   └── api/                         # API route handlers
│
├── components/
│   ├── chat/
│   │   ├── ChatInterface.tsx        # Main chat UI
│   │   ├── MessageBubble.tsx        # Individual message
│   │   ├── CalculationResult.tsx    # Formatted calculation display
│   │   └── TypingIndicator.tsx      # Loading state
│   │
│   ├── navigation/
│   │   ├── ModeSelector.tsx         # Learning vs Project toggle
│   │   ├── DisciplineFilter.tsx     # 4 discipline filter
│   │   └── BackButton.tsx           # Return to home
│   │
│   ├── learning/
│   │   ├── ConceptExplorer.tsx      # Browse concepts
│   │   ├── PracticeProblem.tsx      # Display practice problems
│   │   ├── ProgressTracker.tsx      # Track learning progress
│   │   └── SuggestedPrompts.tsx     # Welcome screen prompts
│   │
│   ├── project/
│   │   ├── ProjectSelector.tsx      # Choose template
│   │   ├── ProjectWorkflow.tsx      # Step-by-step workflow
│   │   ├── AssumptionTracker.tsx    # Side panel assumptions
│   │   ├── CalculationPanel.tsx     # Display calculations
│   │   └── ExportButton.tsx         # Export project
│   │
│   ├── shared/
│   │   ├── SidePanel.tsx            # Collapsible side panel
│   │   ├── FormulaReference.tsx     # Quick formula lookup
│   │   ├── Glossary.tsx             # Term definitions
│   │   └── FinancialTable.tsx       # Formatted tables
│   │
│   └── layout/
│       ├── Header.tsx               # Moo header with nav
│       └── Footer.tsx               # Disclaimer
│
├── hooks/
│   ├── useChat.ts                   # Chat state management
│   ├── useProject.ts                # Project state management
│   ├── useLearning.ts               # Learning progress tracking
│   └── useCalculations.ts           # Tool execution
│
├── utils/
│   ├── api.ts                       # API client
│   ├── formatters.ts                # Format financial data
│   └── validators.ts                # Input validation
│
├── styles/
│   ├── moo.css                      # Main styles (updated for COW branding)
│   ├── chat.css                     # Chat-specific styles
│   ├── financial-tables.css         # Table formatting
│   └── calculations.css             # Calculation display styles
│
└── types/
    ├── chat.ts                      # Chat types
    ├── project.ts                   # Project types
    ├── learning.ts                  # Learning types
    └── calculations.ts              # Calculation types
```

### 9. Sample Knowledge Base Document

```markdown
# NPV_FUNDAMENTALS.md

## Net Present Value (NPV) - Financial Management

### Definition
Net Present Value (NPV) is the difference between the present value of cash 
inflows and the present value of cash outflows over a period of time. NPV is 
used in capital budgeting to analyze the profitability of an investment or project.

### Formula
```
NPV = Σ [CFt / (1 + r)^t] - Initial Investment

Where:
CFt = Cash flow in period t
r = Discount rate (required rate of return)
t = Time period
```

### Decision Rule
- NPV > 0: Accept the project (creates value)
- NPV = 0: Indifferent (breaks even)
- NPV < 0: Reject the project (destroys value)

### Cross-Discipline Connections

**Financial Accounting Link:**
- Cash flows must be based on actual/projected financial data
- Depreciation creates a tax shield (non-cash expense reduces taxable income)
- Working capital changes appear as cash flows

**Cost Accounting Link:**
- Product costs determine revenue potential
- Overhead allocation affects cost projections
- Cost behavior (fixed vs variable) impacts cash flow forecasts

**Management Accounting Link:**
- Use relevant costs only (incremental cash flows)
- Ignore sunk costs
- Consider opportunity costs
- Segment profitability affects project viability

### Example Problem

**Scenario:**
ABC Company is considering purchasing new equipment for $100,000. The equipment 
will generate additional annual cash inflows of $30,000 for 5 years. The 
company's required rate of return is 10%. Assume straight-line depreciation 
and a 25% tax rate.

**Step 1: Calculate annual depreciation**
Depreciation = ($100,000 - $0) / 5 = $20,000 per year

**Step 2: Calculate depreciation tax shield**
Tax Shield = Depreciation × Tax Rate = $20,000 × 0.25 = $5,000 per year

**Step 3: Calculate after-tax cash flows**
Annual Cash Flow = Pre-tax Cash Flow + Tax Shield
Annual Cash Flow = $30,000 + $5,000 = $35,000

**Step 4: Calculate NPV**
Year 0: -$100,000
Year 1-5: $35,000 × PV annuity factor (10%, 5 years)
PV = $35,000 × 3.7908 = $132,678

NPV = $132,678 - $100,000 = $32,678

**Decision:** Accept the project (NPV > 0)

### Common Mistakes
1. Forgetting depreciation tax shield
2. Using accounting profit instead of cash flows
3. Including sunk costs in analysis
4. Wrong discount rate (using cost of debt instead of WACC)
5. Not considering working capital changes
6. Mixing nominal and real rates

### Practice Questions
1. Why do we add back depreciation tax shield?
2. What's the relationship between NPV and IRR?
3. How does the discount rate choice affect NPV?

### Related Concepts
- Internal Rate of Return (IRR)
- Payback Period
- Profitability Index
- Time Value of Money
- Cost of Capital (WACC)
- Depreciation Methods
- Cash Flow Forecasting

---
*Discipline: Financial Management*
*Prerequisites: Time Value of Money, Financial Accounting Basics*
*Difficulty: Intermediate*
```

### 10. Implementation Timeline (2 Weeks)

#### **Week 1: Foundation & Core**

**Days 1-2: Outline Phase**
- [ ] Set up complete project structure (frontend + backend)
- [ ] Create placeholder API endpoints with mock data
- [ ] Build basic UI with mode selector and discipline filter
- [ ] Wire up frontend to backend (end-to-end, even with mocks)
- [ ] **Deliverable**: Can navigate UI, send messages, see mock responses

**Days 3-5: First Draft Phase**
- [ ] Implement all 12 calculation tools with real logic
- [ ] Create 40 knowledge base documents (10 per discipline)
- [ ] Implement simple RAG with FAISS
- [ ] Integrate Claude API with comprehensive system prompt
- [ ] Connect tools to LLM (function calling)
- [ ] Build chat interface with formatted output
- [ ] **Deliverable**: All core functionality works end-to-end

**Days 6-7: Refinement Phase**
- [ ] Polish UI (COW branding, animations, loading states)
- [ ] Add side panels (progress, assumptions, formulas)
- [ ] Improve prompts based on testing
- [ ] Add error handling and input validation
- [ ] Implement conversation persistence (JSON files)
- [ ] **Deliverable**: V1.0 ready for internal testing

#### **Week 2: Projects, Export, & Launch**

**Days 8-9: Project Mode**
- [ ] Build 6 project templates with workflows
- [ ] Implement project state management
- [ ] Create assumption tracker and calculation panel
- [ ] Add project-specific UI components
- [ ] **Deliverable**: All 6 project templates functional

**Days 10-11: Export & Polish**
- [ ] Implement PDF export with proper formatting
- [ ] Add Markdown export option
- [ ] Create formula reference quick lookup
- [ ] Build glossary component
- [ ] Final UI polish and responsive design
- [ ] **Deliverable**: Export works, UI is professional

**Days 12-13: Testing & Documentation**
- [ ] Run comprehensive testing checklist (see Section 11)
- [ ] Fix critical bugs
- [ ] Write user documentation
- [ ] Create demo video/walkthrough
- [ ] **Deliverable**: V1.0 passes all success criteria

**Day 14: Launch**
- [ ] Deploy to production environment
- [ ] Set up monitoring and logging
- [ ] Prepare feedback collection mechanism
- [ ] Announce to initial user group
- [ ] **Deliverable**: V1.0 live and accessible

### 11. Success Criteria & Testing Checklist

#### **Functional Requirements**

**Learning Mode:**
- [ ] Explain any of the 30 concepts clearly to a beginner
- [ ] Show cross-discipline connections (e.g., how depreciation affects NPV)
- [ ] Generate solvable practice problems
- [ ] Check user solutions and provide specific feedback
- [ ] Track concepts covered in session
- [ ] Suggest related concepts and next steps

**Project Mode:**
- [ ] Complete all 6 project templates end-to-end
- [ ] Calculate accurately (match Excel/manual calculations)
- [ ] Guide user through structured workflow
- [ ] Track assumptions and allow modifications
- [ ] Export professional-looking summaries
- [ ] Provide clear decision recommendations

**Calculations:**
- [ ] All 12 tools produce correct numerical results
- [ ] Formatted output is professional and clear
- [ ] Interpretation explains business implications
- [ ] Cross-discipline connections are highlighted

**RAG System:**
- [ ] Returns relevant documents for queries >80% of time
- [ ] Retrieves from appropriate discipline
- [ ] Provides useful context to LLM
- [ ] Response time <3 seconds for search

#### **User Testing (5 Test Users Minimum)**

**Learning Mode Tests:**
- [ ] User with no accounting background can learn NPV concept
- [ ] User can solve a practice problem after explanation
- [ ] User understands difference between financial and management accounting
- [ ] User can navigate between related concepts
- [ ] Progress tracking accurately reflects learning

**Project Mode Tests:**
- [ ] User can complete financial statement preparation project
- [ ] User can complete capital budgeting analysis
- [ ] User receives accurate calculations
- [ ] Export produces usable document
- [ ] User understands decision recommendation

**Integration Tests:**
- [ ] User can see how depreciation connects financial accounting to capital budgeting
- [ ] User can trace product costs from cost accounting through to pricing decision
- [ ] User understands when to use each discipline

**Usability Tests:**
- [ ] Mode switching is intuitive
- [ ] Discipline filter is helpful (not confusing)
- [ ] Chat interface is responsive and smooth
- [ ] Side panels enhance (not clutter) experience
- [ ] Error messages are helpful

#### **Technical Requirements**

- [ ] API response time <2 seconds for simple queries
- [ ] RAG search completes in <1 second
- [ ] Tool calculations execute in <500ms
- [ ] UI loads in <3 seconds
- [ ] No memory leaks in long conversations
- [ ] Graceful error handling throughout
- [ ] Works on desktop, tablet, mobile

#### **Quality Requirements**

- [ ] Calculation accuracy: 100% match with Excel
- [ ] Concept explanations: Reviewed by subject matter expert
- [ ] Professional formatting: Tables, formulas display correctly
- [ ] Branding consistency: Matches COW design guidelines
- [ ] Documentation: Code is well-commented
- [ ] Security: No exposed API keys or sensitive data

### 12. Key Design Decisions

#### **Why All Four Disciplines?**

Business decisions require integrated knowledge:

```
Real Scenario: Should we launch a new product?

Financial Accounting provides:
→ Current financial position (can we afford it?)
→ Revenue recognition policy (when do we record sales?)
→ Impact on financial ratios

Cost Accounting provides:
→ What will it cost to produce?
→ How do we allocate overhead?
→ What's the breakeven volume?

Management Accounting provides:
→ What are the relevant costs?
→ What's the contribution margin?
→ How do we measure success?

Financial Management provides:
→ What's the NPV of launching?
→ What discount rate should we use?
→ Does this beat our hurdle rate?

You need all four to make the decision!
```

#### **Why Start with V1.0 Completeness?**

- **Immediate value**: Users can accomplish real tasks day one
- **Real feedback**: Learn what users actually need vs what we think they need
- **Motivation**: Team sees real usage, stays engaged
- **Revenue**: Can charge for V1 if needed (validates business model)
- **Foundation**: Architecture supports V2+ without refactoring

#### **What's Explicitly NOT in V1.0?**

Save for V2 and beyond:
- ❌ Fine-tuned model (use Claude API directly in V1)
- ❌ Advanced visualizations (basic tables/charts only)
- ❌ Excel live sync (export only)
- ❌ Multi-user collaboration
- ❌ User authentication and accounts
- ❌ Progress persistence across devices
- ❌ Mobile native app
- ❌ Industry-specific templates
- ❌ Instructor/admin dashboard
- ❌ LMS integration
- ❌ Video explanations
- ❌ Gamification/badges

### 13. COW Branding Integration

#### **Visual Design**

**Color Palette** (from COW Communications folder):
- Primary: Deep Cyan (#0066FF) → Keep for headers, CTA buttons
- Secondary: Sky Blue (#0ea5e9) → Use for accents
- Background (Light): Rice Paper (#F5F3F0)
- Background (Dark): Navy Deep (#0a1628)
- Accent: Terracotta, Turquoise, Bamboo (for discipline color-coding)

**Discipline Color Coding**:
- Financial Accounting: Deep Blue (traditional, formal)
- Cost Accounting: Terracotta (manufacturing, tangible)
- Management Accounting: Turquoise (analytical, strategic)
- Financial Management: Bamboo/Green (growth, investment)

#### **Typography**

- Maintain COW's light font weights
- Professional but approachable
- Clear hierarchy in explanations

#### **Iconography**

- Replace sparkles ✨ with calculator/graph hybrid icon
- Create icons for each discipline:
  - Financial Accounting: 📊 Balance sheet icon
  - Cost Accounting: 🏭 Factory/production icon
  - Management Accounting: 📈 Graph/analytics icon
  - Financial Management: 💰 Investment/growth icon

#### **Messaging Tone**

- Professional yet accessible (like COW)
- Educational without being condescending
- Emphasize empowerment through knowledge
- Connect to COW's "wealth intelligence" positioning

**Tagline Options**:
- "Financial Intelligence for Business Decisions"
- "Master the Language of Business"
- "From Accounting to Investment: Complete Financial Intelligence"

### 14. Sample Integrated Use Case

**User Story: "Help me decide if I should outsource manufacturing"**

**Moo's Response Outline**:

```
This is a classic Make-or-Buy decision that integrates all four disciplines. 
Let me walk you through a comprehensive analysis.

📊 STEP 1: GATHER FINANCIAL DATA (Financial Accounting)
First, I need to understand your current financial position:
- What's your current manufacturing cost from your financial statements?
- Do you have idle capacity or would you need to maintain the equipment?
- What's your current asset utilization?

🏭 STEP 2: CALCULATE FULL PRODUCT COST (Cost Accounting)
Let me help you determine the true cost of internal manufacturing:
- Direct materials per unit
- Direct labor per unit
- Variable manufacturing overhead per unit
- Fixed overhead allocation

Then compare to outsourcing quote.

[User provides data]

I've calculated your full product cost using ABC:
Total Internal Cost: $52.30/unit
External Quote: $48.00/unit

📈 STEP 3: RELEVANT COST ANALYSIS (Management Accounting)
Now let's identify only the relevant costs that change:

Internal (Relevant Costs Only):
- Direct materials: $18/unit
- Direct labor: $22/unit
- Variable overhead: $7/unit
- Avoidable fixed overhead: $3/unit
Total Relevant Cost: $50/unit

External:
- Purchase price: $48/unit
- Shipping/handling: $2/unit
Total Relevant Cost: $50/unit

The costs are actually EQUAL when we consider only relevant costs!

💰 STEP 4: LONG-TERM FINANCIAL IMPACT (Financial Management)
But there's more to consider:

If you outsource and sell the equipment:
- Equipment book value: $200,000
- Estimated sale price: $150,000
- After-tax proceeds: $140,000 (assuming 25% tax on loss)

Investment the proceeds at your WACC (10%):
- Annual return: $14,000

This changes the economics significantly over 5 years:
NPV of outsourcing: +$52,400

🎯 RECOMMENDATION:
From a purely financial perspective: OUTSOURCE

Cost savings: Minimal ($0 per unit on relevant cost basis)
Financial benefit: $52,400 NPV from freed capital
Payback period: 2.8 years

However, consider these qualitative factors:
✓ Quality control (you lose direct oversight)
✓ Supply chain risk (dependency on vendor)
✓ Flexibility (harder to make quick changes)
✓ Core competency (is manufacturing strategic?)
✓ Employee impact (potential layoffs)

Would you like me to:
1. Run sensitivity analysis on the vendor quote?
2. Create a detailed project report for stakeholders?
3. Explore the impact on your financial statements?
4. Model different scenarios (partial outsourcing, multiple vendors)?
```

This demonstrates how Moo integrates all four disciplines for complete business analysis.

---

## Appendix A: Sample Calculation Tool Implementation

```python
# financial_management.py

import numpy as np
from typing import Dict, List, Optional

def calculate_npv(
    cash_flows: List[float],
    discount_rate: float,
    initial_investment: float,
    tax_rate: float = 0.0,
    depreciation_method: str = "straight_line",
    salvage_value: float = 0.0,
    useful_life: int = None
) -> Dict:
    """
    Calculate Net Present Value with depreciation tax shield
    
    Args:
        cash_flows: List of annual pre-tax cash flows
        discount_rate: Required rate of return (WACC)
        initial_investment: Initial outlay
        tax_rate: Corporate tax rate (for tax shield calculation)
        depreciation_method: Method for tax shield calculation
        salvage_value: Expected salvage value at end
        useful_life: Asset useful life (for depreciation)
    
    Returns:
        Dict containing NPV, breakdown, interpretation
    """
    
    # Calculate depreciation schedule if tax rate provided
    annual_depreciation = 0
    if tax_rate > 0 and useful_life:
        depreciable_base = initial_investment - salvage_value
        if depreciation_method == "straight_line":
            annual_depreciation = depreciable_base / useful_life
    
    # Calculate tax shield
    annual_tax_shield = annual_depreciation * tax_rate
    
    # Adjust cash flows for tax shield
    adjusted_cash_flows = [cf + annual_tax_shield for cf in cash_flows]
    
    # Calculate present values
    pv_cash_flows = []
    for t, cf in enumerate(adjusted_cash_flows, start=1):
        pv = cf / ((1 + discount_rate) ** t)
        pv_cash_flows.append({
            'year': t,
            'cash_flow': cf,
            'discount_factor': 1 / ((1 + discount_rate) ** t),
            'present_value': pv
        })
    
    # Add salvage value if present
    if salvage_value > 0:
        t = len(cash_flows)
        pv_salvage = salvage_value / ((1 + discount_rate) ** t)
        pv_cash_flows.append({
            'year': t,
            'cash_flow': salvage_value,
            'discount_factor': 1 / ((1 + discount_rate) ** t),
            'present_value': pv_salvage,
            'note': 'Salvage value'
        })
    
    # Calculate NPV
    total_pv = sum(item['present_value'] for item in pv_cash_flows)
    npv = total_pv - initial_investment
    
    # Calculate profitability index
    profitability_index = total_pv / initial_investment if initial_investment > 0 else 0
    
    # Interpretation
    if npv > 0:
        interpretation = f"ACCEPT: Project creates ${npv:,.2f} in value (NPV > 0)"
        recommendation = "accept"
    elif npv == 0:
        interpretation = "INDIFFERENT: Project breaks even (NPV = 0)"
        recommendation = "indifferent"
    else:
        interpretation = f"REJECT: Project destroys ${abs(npv):,.2f} in value (NPV < 0)"
        recommendation = "reject"
    
    # Build detailed response
    result = {
        'npv': round(npv, 2),
        'profitability_index': round(profitability_index, 4),
        'recommendation': recommendation,
        'interpretation': interpretation,
        
        'calculation_details': {
            'initial_investment': initial_investment,
            'discount_rate': discount_rate,
            'total_pv_inflows': round(total_pv, 2),
            'annual_depreciation': round(annual_depreciation, 2),
            'annual_tax_shield': round(annual_tax_shield, 2),
        },
        
        'cash_flow_schedule': pv_cash_flows,
        
        'formatted_output': format_npv_output(
            npv, initial_investment, pv_cash_flows, 
            discount_rate, annual_tax_shield, interpretation
        ),
        
        'cross_discipline_notes': {
            'financial_accounting': (
                f"This investment will create an annual depreciation expense of "
                f"${annual_depreciation:,.2f}, which will appear on the income statement "
                f"and reduce net income but does not affect cash flow."
            ),
            'cost_accounting': (
                "Ensure that cash flow projections include all relevant product costs "
                "and overhead allocations. Fixed overhead may not be relevant if "
                "capacity already exists."
            ),
            'management_accounting': (
                "Remember to include only incremental cash flows. Ignore sunk costs "
                "and allocated costs that won't change. Consider opportunity costs."
            )
        }
    }
    
    return result


def format_npv_output(npv, initial_inv, pv_schedule, rate, tax_shield, interp):
    """Format NPV calculation for display"""
    
    output = f"""
═══════════════════════════════════════════
NET PRESENT VALUE ANALYSIS
═══════════════════════════════════════════

Initial Investment:     ${initial_inv:>12,.2f}
Discount Rate:          {rate:>12.1%}
Annual Tax Shield:      ${tax_shield:>12,.2f}

CASH FLOW SCHEDULE
{'Year':<6} {'Cash Flow':>12} {'Discount':>10} {'Present Value':>15}
{'':—<6} {'':-<12} {'':-<10} {'':-<15}
"""
    
    for item in pv_schedule:
        note = item.get('note', '')
        output += f"{item['year']:<6} ${item['cash_flow']:>11,.2f} {item['discount_factor']:>10.4f} ${item['present_value']:>14,.2f}"
        if note:
            output += f"  ({note})"
        output += "\n"
    
    total_pv = sum(item['present_value'] for item in pv_schedule)
    
    output += f"""
{'':—<6} {'':-<12} {'':-<10} {'':-<15}
Total PV of Inflows:    ${total_pv:>12,.2f}
Less: Initial Investment: ${initial_inv:>12,.2f}
{'':=<43}
NET PRESENT VALUE:      ${npv:>12,.2f}
{'':=<43}

DECISION: {interp}

PROFITABILITY INDEX: {total_pv/initial_inv:.4f}
(For every $1 invested, you get ${total_pv/initial_inv:.2f} back in PV terms)
"""
    
    return output
```

---

## Appendix B: Sample Knowledge Base Document Structure

Each document in `/knowledge/v1/` follows this template:

```markdown
# [CONCEPT_NAME].md

## [Full Concept Title] - [Discipline]

### Definition
[Clear, concise definition]

### Formula (if applicable)
```
[Formula with variable definitions]
```

### When to Use
[Practical guidance on applicability]

### Cross-Discipline Connections
**Financial Accounting Link:**
[How this connects to financial accounting]

**Cost Accounting Link:**
[How this connects to cost accounting]

**Management Accounting Link:**
[How this connects to management accounting]

**Financial Management Link:**
[How this connects to financial management]

### Step-by-Step Process
1. [Step one]
2. [Step two]
...

### Example Problem
**Scenario:**
[Business context]

**Step 1: [Description]**
[Calculation and explanation]

**Step 2: [Description]**
[Calculation and explanation]

...

**Conclusion:**
[Interpretation and decision]

### Common Mistakes
1. [Common mistake and how to avoid]
2. [Common mistake and how to avoid]
...

### Practice Questions
1. [Concept question]
2. [Application question]
3. [Integration question]

### Related Concepts
- [Related concept 1]
- [Related concept 2]
...

---
*Discipline: [Primary Discipline]*
*Prerequisites: [List of prerequisite concepts]*
*Difficulty: [Beginner | Intermediate | Advanced]*
*Cross-Discipline: [Yes | No]*
```

---

## Conclusion: Ship V1.0 in 2 Weeks

This plan provides a complete, working Financial Intelligence Assistant that:

✅ **Covers all four accounting/finance disciplines** (not just management accounting)
✅ **Integrates disciplines** for realistic business scenarios
✅ **Works end-to-end** from day one (no placeholder features)
✅ **Scales to V2/V3** without architectural refactoring
✅ **Maintains COW branding** and design standards
✅ **Testable immediately** with real users

**Next Steps:**
1. Review this plan with stakeholders
2. Gather COW branding assets from Communications folder
3. Set up development environment
4. Begin Week 1, Day 1: Outline Phase
5. Ship V1.0 in 14 days

**Success Metrics for V1.0:**
- 5+ test users complete learning module successfully
- 3+ test users complete project end-to-end
- 100% calculation accuracy vs Excel
- <2 second response time
- Zero critical bugs in happy path
- Positive feedback on integration approach

Let's build Moo into the most comprehensive financial intelligence assistant available! 🚀
