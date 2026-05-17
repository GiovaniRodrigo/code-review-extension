import { 
  AIAnalysisRequestDTO, 
  AIAnalysisResponseDTO, 
  AIProviderPort, 
  HealthStatusDTO 
} from '@code-review/core';

export class GeminiMockProvider implements AIProviderPort {
  async checkHealth(): Promise<HealthStatusDTO> {
    return { status: 'available' };
  }

  async analyzeCode(input: AIAnalysisRequestDTO): Promise<AIAnalysisResponseDTO> {
    // This mock is based on the specific response provided by the user.
    // The Gemini API response structure is simulated here.
    
    const mockResponse = {
      "candidates": [
        {
          "content": {
            "parts": [
              {
                "text": "AI learns from **vast amounts of data** to identify **patterns** and make **predictions**.",
                "thoughtSignature": "EtUGCtIGAQw51sc7FfW+ejIQWOpVsDkhLmF+pzHL/C5rcoQKuiLvtds+7XGjtJIh9GiG5FNmFOIwhJOTBabWIp2LBo2j1MRhWoQ3n1FBA14sD5P2+sAl+juZSoG3qY2wgb8OHyenvllCF8gfi0zdOIhFimUeIPOxfchFL2VvOhSc5ZJRAQa5QuvMI7xTJz23dGWyaliqzttjvOW0ZfZNRR1DSYQX1mKLV4eslXswnjP3WTUPkeeifQG7rJkd90DGxQ7VCqiLEVABh5iu4LP6IPjbESiTZsPqOZ7DM/0PNrHPhafsqY1kMt47qEA2wEv2b67cQBJKY7LdPBbmHkjZNvOn67TGWYmhrP3uxrGv7wmh0u8mDgSG1qBQwjhnM9+ezGSh1FmGXK6WOvyZ6AiGmXKnEwhE4r7VgQv6E8SgBhtnnebdYDkh6FnaGoJ7Kbct+kOkmIXdW6wOmiMceIT1MqryJvs/cbSK3R0EHldc1dkFDT6tPKMRYE0kQPItVhYuYjZOIsgxrVs/lQSJbqlFnw25ObA1f0dg3/DyNCMCFvtsUjI9XUXay2CpEJTlt/XQU3HMMyVa2241DdL5zCn17GH62UKcYN3ObgJMezVK+jCsjO7qu/WK/dkbA+5IMgceNaL/9ecGlWNr2+53s/o7ir4A8V8DtvR+DkMFt5Ew9aYTO0cxSHhgZrflYrE56qjHUW3f2Pfowj6rIrMgexfnMrXv4B/pxOyXSb7xi/lixWGZoz5GrpkW1Md27uRokvBVP1J1rovJg1XRxxgMP1EunGRC0ilXYKo46Ic8NmNHylq1EPk9y2Y0ZYSvnobkJgRygche3sa7QAeab5y19bqk8wsfwivQcYytnQIhrJgO6ogeluhcnL3gb5DP/F1zxSJ3/mp+jokYP3pEo1c7q2btvjmxDH/2rCp6d/jt7Ks6ixN8Y5R2MaTB/EmexD2O1KDMNjvPvHQh0aDGq/LXDambbYf53lzvgo5bRn+IFlJuS75DYHCYD/V8N4ZwsCkVilnlUw0atAi24zOjNpku5RzY/Br0Gab4855Hf0nwqc1LmjXg//DFJS/u6wVsi7U0uwT9ckjBWktYqUlNAaq2RsnAKDSQBjo14t/ZQaTFE4HHJtr8k63AZBO83A=="
              }
            ],
            "role": "model"
          },
          "finishReason": "STOP",
          "index": 0
        }
      ],
      "usageMetadata": {
        "promptTokenCount": 8,
        "candidatesTokenCount": 19,
        "totalTokenCount": 232,
        "promptTokensDetails": [
          {
            "modality": "TEXT",
            "tokenCount": 8
          }
        ],
        "thoughtsTokenCount": 205,
        "serviceTier": "standard"
      },
      "modelVersion": "gemini-3-flash-preview",
      "responseId": "bPAIas-oE429qtsPx4mW-Q0"
    };

    // We simulate the parsing logic of GeminiProvider
    const text = mockResponse.candidates[0].content.parts[0].text;

    return {
      findings: [
        {
          file: input.filePath,
          line: 1,
          severity: 'info',
          category: 'code_smell',
          message: text,
          suggestedFix: '',
          confidenceScore: 1.0
        }
      ],
      confidenceScore: 1.0
    };
  }
}
