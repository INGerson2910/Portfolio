from pathlib import Path


class PromptBuilder:
    def __init__(self) -> None:
        prompts_dir = Path(__file__).resolve().parent.parent / "prompts"
        self.coverage_prompt_file = prompts_dir / "coverage_extraction_prompt.txt"
        self.testcase_prompt_file = prompts_dir / "exhaustive_testcase_prompt.txt"
        self.repair_prompt_file = prompts_dir / "repair_testcase_prompt.txt"

    def build_coverage_prompt(
        self,
        requirement_text: str,
        generation_notes: str | None = None,
    ) -> tuple[str, str]:
        system_prompt = self.coverage_prompt_file.read_text(encoding="utf-8").strip()
        notes_section = generation_notes.strip() if generation_notes else "None"

        user_prompt = f"""
Requirement text:
\"\"\"
{requirement_text}
\"\"\"

Generation notes:
\"\"\"
{notes_section}
\"\"\"
""".strip()

        return system_prompt, user_prompt

    def build_testcase_prompt(
        self,
        requirement_text: str,
        coverage_json: str,
        generation_notes: str | None = None,
    ) -> tuple[str, str]:
        system_prompt = self.testcase_prompt_file.read_text(encoding="utf-8").strip()
        notes_section = generation_notes.strip() if generation_notes else "None"

        user_prompt = f"""
Requirement text:
\"\"\"
{requirement_text}
\"\"\"

Coverage model:
\"\"\"
{coverage_json}
\"\"\"

Generation notes:
\"\"\"
{notes_section}
\"\"\"
""".strip()

        return system_prompt, user_prompt

    def build_repair_prompt(
        self,
        requirement_text: str,
        original_json: str,
        validation_errors: list[str],
    ) -> tuple[str, str]:
        system_prompt = self.repair_prompt_file.read_text(encoding="utf-8").strip()

        joined_errors = "\n".join(f"- {err}" for err in validation_errors) or "- Unknown validation failure"

        user_prompt = f"""
Requirement text:
\"\"\"
{requirement_text}
\"\"\"

Current generated JSON:
\"\"\"
{original_json}
\"\"\"

Validation errors that must be fixed:
{joined_errors}
""".strip()

        return system_prompt, user_prompt