import axios from "axios";

export const handler = async (event, context) => {
    const {locKey} = event.queryStringParameters;
    const url = `http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${locKey}?apikey=${API_KEY}&details=true&metric=true HTTP/1.1`;

    try {
        const res = await axios.get(url);
        const data = res.data;
        console.log(data);
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