export interface MaskingRule {
    name: string;
    pattern: RegExp;
    replacement: string;
}

export class DataMaskingService {
  private rules: MaskingRule[] = [
    {
      name: 'Email',
      pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
      replacement: '[EMAIL_REDACTED]'
    },
    {
      name: 'IPv4',
      pattern: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
      replacement: '[IP_REDACTED]'
    },
    {
      name: 'API_Key_Assignment',
      pattern: /((?:key|token|secret|password|passwd|auth|api_key|apikey)[\s:=]+)(['"`])[\w\d-]{10,}\2/gi,
      replacement: '$1"[SECRET_REDACTED]"'
    },
    {
        name: 'Generic_Secret',
        pattern: /(['"])(?:[a-zA-Z0-9+/]{40,}|[a-fA-F0-9]{32,}|[a-zA-Z0-9-_]{20,})\1/g,
        replacement: '"[POTENTIAL_SECRET_REDACTED]"'
    }
  ];

  mask(text: string): string {
    let maskedText = text;
    this.rules.forEach(rule => {
      maskedText = maskedText.replace(rule.pattern, rule.replacement);
    });
    return maskedText;
  }
}
