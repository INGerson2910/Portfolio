from pathlib import Path


class PromptBuilder:
    def __init__(self) -> None:
        self.prompt_file = (
            Path(__file__).resolve().parent.parent / "prompts" / "exhaustive_testcase_prompt.txt"
        )

    def build(self, requirement_text: str, generation_notes: str | None = None) -> str:
        system_prompt = self.prompt_file.read_text(encoding="utf-8")
        notes_section = generation_notes.strip() if generation_notes else "None"

        execution_rules = """
Additional execution rules:
- Infer realistic dummy values when the requirement implies field rules
- For form scenarios, always generate concrete values for each field
- For API scenarios, always generate request data including payload, headers, params, or tokens when applicable
- Never leave test_data empty
- Never use vague test data descriptions
- Prefer executable test data over descriptive labels
""".strip()

        return f"""
{system_prompt}

{execution_rules}

Requirement text:
\"\"\"
{requirement_text}
\"\"\"

Generation notes:
\"\"\"
{notes_section}
\"\"\"
""".strip()