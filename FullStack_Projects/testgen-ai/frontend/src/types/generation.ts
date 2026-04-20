export interface TestCaseRow {
  tc_id: string;
  test_type: string;
  description: string;
  steps: string;
  test_data_format: string;
  test_data: string;
  expected_result: string;
  pre_conditions: string;
  automatable: string;
  pass_field: string;
  actual_result: string;
}

export interface GenerationResponse {
  feature_name: string;
  test_plan_summary: string;
  assumptions: string[];
  coverage_areas: string[];
  warnings: string[];
  test_cases: TestCaseRow[];
}

export interface GenerationRequest {
  requirement_text: string;
  prompt_preset?: string;
  generation_notes?: string;
}