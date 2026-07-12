export interface TextMateCaptureRule {
  name: string;
}

export interface TextMateRule {
  name?: string;
  include?: string;
  match?: string;
  begin?: string;
  end?: string;
  captures?: Record<string, TextMateCaptureRule>;
  beginCaptures?: Record<string, TextMateCaptureRule>;
  endCaptures?: Record<string, TextMateCaptureRule>;
  patterns?: TextMateRule[];
}

export interface TextMateGrammar {
  $schema?: string;
  name: string;
  scopeName: string;
  patterns: TextMateRule[];
  repository: Record<string, TextMateRule>;
}
