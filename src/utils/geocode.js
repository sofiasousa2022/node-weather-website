const request = require('request')

//API: Geocoding

//Vamos definir uma nova função (incorporando o request) para o Geocoding e depois chama-la:
const geocode = (address, callback) => {
    const url='https://api.mapbox.com/geocoding/v5/mapbox.places/'+ encodeURIComponent(address) +'.json?access_token=pk.eyJ1Ijoic29maWE1NTkiLCJhIjoiY2w5Y3oxdmpxMTloYjNvcXRrdW84Zmw3MCJ9.HR4Kvg9wdzEWe26-Lq56oQ&limit=1' // O encodeURIComponent serve para caracteres especiais
    
    //request ({url: url, json: true}, (error, response) => {
    request ({url, json: true}, (error, { body }) => { //formato reduzido no URL e a response que é um objecto pelo que podemos só passar a propriedade que queremos e transformar em variavel
        if (error) {
            callback('Unable to connect to Geocoding service', undefined) //undefined porque não vamos passar nada para data_geo, pq já sabemos que este é um erro
        } else if (body.features.length === 0) { 
            callback('Erro: No location found', undefined) 
        } else {
            const latitude = body.features[0].center[1]
            const longitude = body.features[0].center[0]
            const location = body.features[0].place_name
            /*callback (undefined,  {
                                    latitude: response.body.features[0].center[1],
                                    longitude: response.body.features[0].center[0],
                                    location: response.body.features[0].place_name
                                    })*/
            callback (undefined,  { 
                                    latitude,
                                    longitude,
                                    location
                                  })
        }

    })
}

module.exports = {
    geocode
}

