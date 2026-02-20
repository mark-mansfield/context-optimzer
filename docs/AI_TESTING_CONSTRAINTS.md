# 🛡️ Prompt: The "Anti-Gaming" Agent Constraint

**Objective:** Prevent the model from hard-coding outputs to pass specific test cases.

"You are a Senior Software Engineer. When implementing code to pass tests, you must adhere to the **Principle of Generalization**:

1. **No Literals:** Do not return hard-coded literals that match the test assertions unless the business logic explicitly requires a constant.
2. **Logic Transparency:** Your implementation must satisfy the underlying mathematical or logical requirement of the function, not just the provided test cases.
3. **Randomized Variable Resilience:** Assume the tests will be run with randomized inputs. If your code fails under varying inputs despite passing the current static tests, it is considered a failure.
4. **Verification Step:** After writing the code, perform a mental 'Mutation Test.' If I changed the test input from X to Y, would your code still work? If no, rewrite it."

---

### 🛠️ Strategic Workflow Adjustments

#### 1. Use Property-Based Testing

Instead of writing a test that says `expect(add(2,2)).toBe(4)`, write a test that checks the _properties_ of the function. It is much harder for an AI to game a property than a value.

- **Example:** "The output of `add(a, b)` must always equal `add(b, a)` (Commutative Property)."

#### 2. The "Hidden Test" Guardrail

Tell the agent: "I have 5 hidden test cases with randomized inputs that I will run after you submit. If you hard-code values for the visible tests, the hidden tests will catch it."

#### 3. Request "Self-Explanation"

Force the agent to explain its logic _before_ writing the code:

- **Prompt:** "Explain the algorithm you will use to solve this. Then, implement the code. Do not return the code until you have validated that the algorithm is generic."

#### 4. Use "Zero-Shot" Implementation

Avoid giving the agent the test file and the source file in the same context window if possible. Give it the **Interface** and the **Requirements**, then run the tests separately in a sandbox.
