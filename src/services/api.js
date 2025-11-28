const apiKey = process.env.EXPO_PUBLIC_YOUR_API_KEY;
const BASE_URL = `https://v6.exchangerate-api.com/v6/${apiKey}/latest`

export async function exchangeRateApi(fromCurrency) {
    try {
        const response = await fetch(`${BASE_URL}/${fromCurrency}`); // Debugging line to check response status
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}