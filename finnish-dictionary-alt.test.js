var FinnishDictionary = require("./finnish-dictionary.js");

describe('FinnishDictionary', () => {
    const url = 'https://sanakirja.pythonanywhere.com/api/nrand/5';
    const dictionary = new FinnishDictionary(url);

    it('should retrieve data successfully', async () => {
        const mockResponse = { data: ['word1', 'word2', 'word3'] };
        jest.spyOn(global, 'fetch').mockImplementation(() => Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockResponse),
        }));

        const data = await dictionary.getWords();
        expect(data).toEqual(mockResponse);
    });

    it('should handle timeout error', async () => {
        jest.spyOn(global, 'fetch').mockImplementation(() => new Promise((resolve, reject) => {
            setTimeout(() => {
                reject(new Error('Timeout'));
            }, 1000);
        }));

        await expect(dictionary.getWords()).rejects.toThrowError('Failed to retrieve data after 3 attempts');
    }, 60000);

    it('should handle network error', async () => {
        jest.spyOn(global, 'fetch').mockImplementation(() => Promise.reject(new Error('Network error')));

        await expect(dictionary.getWords()).rejects.toThrowError('Failed to retrieve data after 3 attempts');
    });

    it('should handle invalid response', async () => {
        jest.spyOn(global, 'fetch').mockImplementation(() => Promise.resolve({
            ok: false,
            status: 500,
        }));

        await expect(dictionary.getWords()).rejects.toThrowError('Failed to retrieve data after 3 attempts');
    });
});