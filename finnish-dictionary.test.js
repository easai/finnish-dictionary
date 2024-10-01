var FinnishDictionary = require("./finnish-dictionary.js");

describe("FinnishDictionary", () => {
    const url = "https://sanakirja.pythonanywhere.com/api/nrand/5";
    const dictionary = new FinnishDictionary(url);

    afterEach(() => {    
        jest.clearAllMocks();
      });

    it("should return data on successful request", async () => {
        const mockResponse = {
            words: ["hei", "kiitos"]
        };
        jest.spyOn(global, "fetch").mockImplementation(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockResponse),
            })
        );

        const data = await dictionary.getWords();
        expect(data).toEqual(mockResponse);
    }, 60000);

    it("should throw an error on failed request", async () => {
        const mockError = new Error("Failed to retrieve data after 3 attempts");
        jest
            .spyOn(global, "fetch")
            .mockImplementation(() => Promise.reject(mockError));

        await expect(dictionary.getWords()).rejects.toThrow(mockError);
    }, 60000);

    it("should retry the request up to 3 times on failure", async () => {
        const mockError = new Error("Failed to retrieve data after 3 attempts");
        const fetchSpy = jest
            .spyOn(global, "fetch")
            .mockImplementation(() => Promise.reject(mockError));

        await expect(dictionary.getWords()).rejects.toThrow(mockError);
        expect(fetchSpy).toHaveBeenCalledTimes(3);
    }, 60000);

});

