const request = require('request')

const forecast = (lat, long, callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=2d6516f1757778d5fd9ad165a1df30e2&query='+ lat + ','+ long + '&units=f'

    // Funçao request que agora vamos usar. Nota ela já existe, nós so a importamos e podemos usar. Ela tem dois parametros.
    // Primeiro é um objecto que têm como propriedade o URL, json (como é passada a true vai transformar json em JS), entre outras que podemos ver no site
    // Segundo é uma função que corre quando recebemos a resposta de volta. 
    // Esta função é chamada com dois argumentos: error > quando existe um, caso não exista vai receber undefined | response > com a resposta
    //  request ({ url, json: true }, (error, response) => {
        request ({ url, json: true }, (error, { body } ) => {  // response é um objecto pelo que podemos só passar a propriedade que queremos e transformar em variavel
            if (error) { // se houver erro (falta net p.ex. imprime uma mensagem)
                callback ('Unable to connect to weather service', undefined)
            } else if (body.success === false) { // se por exemplo se enganarem na localização vai dar uma resposta mas essa resposta têm erro por isso conseguimos mostrar o erro atraves do info
                callback ('Erro: ' + body.error.info, undefined)
            } else { // se não houver erro imprime o que queremos:
                callback (undefined, 'Type of weather: ' + body.current.weather_descriptions[0] + '. It is currently ' + body.current.temperature + 'º, but it feels like ' + body.current.feelslike + 'º. And the humidity is '+ body.current.humidity)
            }
        })
}

module.exports = {
    forecast
}