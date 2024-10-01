// finnish-dictionary.js
class FinnishDictionary {
  constructor(url) {
    this.url = url;
  }

  async getWords() {
    const maxAttempts = 1;
    const timeout = 5000; // 5 seconds
    const waitTime = 1000; // 1 second

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const controller = new AbortController();
      const signal = controller.signal;

      var timeoutId=setTimeout(() => {
        controller.abort();
      }, timeout);

      try {
        const response = await fetch(this.url, { signal });
        if (response.ok) {
          const data = await response.json();
          clearTimeout(timeoutId);
          return data;
        }
      } catch (error) {
        if (error.name === "AbortError") {
          console.log(`Attempt ${attempt + 1} timed out`);
        } else {
          console.log(`Attempt ${attempt + 1} failed: ${error.message}`);
        }
      }
      clearTimeout(timeoutId);

      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }

    throw new Error("Failed to retrieve data after 3 attempts");
  }
}

module.exports = FinnishDictionary;
