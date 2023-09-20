import axios from "axios";

export const handler = async (event, context) => {
    const {locValue} = event.queryStringParameters;
    const url = `http://dataservice.accuweather.com/locations/v1/search?apikey=${process.env.API_KEY}&q=${locValue}&details=true HTTP/1.1`;

    try {
        const res = await axios.get(url);
        const data = res.data;
        return {
            statusCode : 200,
            body : JSON.stringify(data)
        }
    }
    catch(err) {
        return {
            statusCode : 522,
            body : err.stack
        }
    }
}