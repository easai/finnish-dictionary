// finnish-dictionary.js

// Maximum number of attempts to fetch data
const MAX_ATTEMPTS = 3;

// Class to interact with the Finnish dictionary API
class FinnishDictionary {
    constructor(url) {
        this.url = url; // API URL
    }

    // Asynchronous method to fetch words from the dictionary
    async getWords() {
        const timeout = 5000; // 5-second timeout for each request
        const waitTime = 1000; // 1-second wait time between attempts

        // Loop to execute multiple attempts to fetch data
        for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
            console.log(`Attempt ${attempt + 1} to fetch data`);

            // Create a controller to manage requests that time out
            const controller = new AbortController();
            const signal = controller.signal;

            // Set up a timeout to abort the request if it takes too long
            const timeoutId = setTimeout(() => {
                controller.abort();
            }, timeout);

            try {
                // Send the fetch request with signal handling for cancellation
                const response = await fetch(this.url, {
                    signal
                });

                // Check the HTTP response status
                if (response.ok) {
                    const data = await response.json(); // Convert the response to JSON
                    clearTimeout(timeoutId); // Clear the timeout
                    console.log("Data fetched successfully");
                    return data; // Return the fetched data
                } else {
                    // Handle HTTP errors with specific messages
                    this.handleHttpError(response.status);
                }
            } catch (error) {
                if (error.name === "AbortError") {
                    console.log(`Attempt ${attempt + 1} timed out`);
                } else {
                    console.log(`Attempt ${attempt + 1} failed: ${error.message}`);
                }
            }
            clearTimeout(timeoutId); // Clear the timeout if the error is not a timeout

            // Wait before making a new attempt
            await this.delay(waitTime);
        }

        // If all attempts fail, throw an error
        throw new Error(`Failed to retrieve data after ${MAX_ATTEMPTS} attempts`);
    }

    // Method to handle HTTP errors
    handleHttpError(status) {
        switch (status) {
            case 301:
                console.log(
                    "Moved Permanently: The requested resource has been permanently moved to a new URL."
                );
                break;
            case 302:
                console.log(
                    "Found: The requested resource is temporarily located at a different URL."
                );
                break;
            case 304:
                console.log(
                    "Not Modified: The resource has not been modified since the last request."
                );
                break;
            case 400:
                console.log(
                    "Bad Request: The server could not understand the request."
                );
                break;
            case 401:
                console.log(
                    "Unauthorized: Access is denied due to invalid credentials."
                );
                break;
            case 403:
                console.log(
                    "Forbidden: You do not have permission to access this resource."
                );
                break;
            case 404:
                console.log("Not Found: The requested resource could not be found.");
                break;
            case 405:
                console.log(
                    "Not Modified: The resource has not been modified since the last request."
                );
                break;
            case 408:
                console.log(
                    "Request Timeout: The server would like to shut down this unused connection."
                );
                break;
            case 409:
                console.log(
                    "Conflict: The request could not be completed due to a conflict with the current state of the resource."
                );
                break;
            case 429:
                console.log(
                    "Too Many Requests: The user has sent too many requests in a given amount of time."
                );
                break;
            case 500:
                console.log("Internal Server Error: The server encountered an error.");
                break;
            case 501:
                console.log(
                    "Not Implemented: The request method is not supported by the server and cannot be handled."
                );
                break;
            case 502:
                console.log(
                    "Bad Gateway: The server, while acting as a gateway or proxy, received an invalid response from the upstream server."
                );
                break;
            case 503:
                console.log(
                    "Service Unavailable: The server is currently unable to handle the request."
                );
                break;
            case 504:
                console.log(
                    "Gateway Timeout: The server, while acting as a gateway or proxy, did not get a response in time from the upstream server."
                );
                break;
            case 505:
                console.log(
                    "HTTP Version Not Supported: The HTTP version used in the request is not supported by the server."
                );
                break;
            default:
                console.log(`Unexpected HTTP error: ${status}`);
        }
    }

    // Method to introduce a delay (wait) between attempts
    delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}

module.exports = FinnishDictionary;