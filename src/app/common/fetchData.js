import request from 'request-promise';

export default function fetchData(reqObj){
    if(Object.keys(reqObj).length > 0){
        let url = reqObj.url;

        const options = {
            method: reqObj.type,
            uri: url,
            json: true,
            resolveWithFullResponse: true,
        }

        return request(options); // returns a promise

    }
}