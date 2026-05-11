
export class OllamaProvider {
  async generate(prompt: string) {
    const controller = new AbortController();

    const timeout = setTimeout(() => {
      controller.abort();
    }, 20000);

    try {
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'deepseek-coder:latest',
          prompt,
          stream: false
        })
      });

      const data = await response.json();

      return data.response;
    } finally {
      clearTimeout(timeout);
    }
  }
}
