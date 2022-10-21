const geocodeFile = require ('./utils/geocode.js') // Importar o ficheiro geo
const forecastFile = require ('./utils/forecast.js') // Importar o ficheiro forecast

const path = require ('path') // Load do modulo para descobrir caminhos
const express = require ('express') // Load do express (modulo npm)
const hbs = require ('hbs') // Load do hbs (modulo npm)


// Express é uma função sem argumentos de entrada pelo que para executar basta escrever express() e vamos guardar isso na variavel app para depois podermos usar os metodos.
const app = express()


// DEFINE PATHS FOR EXPRESS CONFIG
// Ir buscar o directorio que queremos (onde temos as paginas HTML), usamos o path e join 
const publicDirectoryPath = path.join(__dirname,'../public')
// Se mudarmos a pasta views de nome (p.ex:views), o programa deixa de funcionar, por isso temos que criar a variavel com o path dessa pasta:
const viewsPath = path.join(__dirname,'../templates/views')
// Path dos partials
const partialsPath = path.join(__dirname,'../templates/partials')


// SETUP HANDLEBARS ENGINE AND VIEW LOCALTION
// Usar ficheiros hbs:
app.set('view engine','hbs')
// Usar o app.set para indicar onde estão as views> 1 arg: 'views', 2 arg: path 
app.set('views', viewsPath)
// Poder usar os partials
hbs.registerPartials(partialsPath)


// SETUP STATIC DIRECTORY TO SERVE
// Para usar os ficheiros HTML temos que colocar a pasta em que estão e ele "resolve" o rooting pelo nome dos ficheiros:
app.use(express.static(publicDirectoryPath))



// Pagina index.hbs
app.get('' , (req, res) => { //render trata dos ficheiros view (que são conseguidos pelo hbs que é descontruido no app.set). No primeiro argumento, vai o nome do ficheiro (sem extensão) e no segundo vai um objecto com as propriedades que depois colocarmos no ficheiro, para alterar dinamicamente
    res.render('index', {
                        title: 'Weather APP by Sofia',
                        name: 'Sofia Sousa'
                        }
    ) 
})

// Pagina about.hbs
app.get('/about' , (req, res) => {
    res.render('about', {
                        title: 'About me',
                        name: 'Sofia Sousa'
        }   
    ) 
})

// Pagina help.hbs
app.get('/help' , (req, res) => {
    res.render('help', {
            helpText: 'This a help text',
            title: 'Help',
            name: 'Sofia Sousa'
        }
    )
})


// Imaginemos que temos o dominio app.com. Quando alguem visita este dominio mostramos lhe alguma coisa, e vamos ter outras paginas, por exemplo: app.com/help e app.com/about. Ou seja temos apenas um servidor: app.com mas temos diferentes routings 
// Sendo assim, como fazemos com que o servidor saiba para que pagina é direcionada? Atraves do método da app.get (não esquecer que app é o express()):
// O método get recebe dois argumentos: Primeiro o routing ( se não for passado nada é o do servidor) e segundo uma função (que vai descrever o que reenviar para o utilizador tendo em conta aquele URL)
        // A função (do parametro 2) recebe dois argumentos, o primeiro é um objecto (normalmente designado req) (contem informação do incoming request) e o outro é a response (normalmente designado res) que tem muitos metodos que podemos usar, por exemplo res.send()

        /*  Comentado porque agora com o app.use e as paginas que criamos já não precisamos destes direcionamentos
app.get('', (req, res) => {
    res.send('<h1> OLA SOFIA </h1>') // normalmente vamos enviar ficheiros ou codigo html ou json
})

// Segundo routing para o /help
app.get('/help', (req, res) => {
    res.send([{ // Podemos enviat tambem um array de objectos, e ele vai detatar JS e transformar em JSON
        name: 'Sofia',
        age: 32
    }, 
    {name: 'Pedro'}
    ])
})

// Terceiro routing para o /about
app.get('/about', (req, res) => {
    const a = '<h1>About page</h1>'
    res.send(a) 

})*/

// Routing para o /weather
app.get('/weather', (req, res) => {
    weatherQuery = req.query
    if (!weatherQuery.address) { // Para garantir que passam o address
        return res.send({
                erro: 'You have to provide a address'})
    }
    
    geocodeFile.geocode(weatherQuery.address, (error_geo, {latitude, longitude, location} = {}) => {  //versão melhorada, o que passava no data_geo era um objecto por isso podemos por directamente
        if (error_geo) {
            return res.send ({
                erro: error_geo
            })
        } else {
            forecastFile.forecast (latitude, longitude, (error, data) => { 
                if (error) {
                    return res.send ({
                        erro: error
                    })
                }
                res.send({
                    forecast: data,
                    location,
                    address: weatherQuery.address,
                })
                /*console.log('Location: ', location)
                console.log('Data: ', data)*/
            })
    }
    })         

})


/*
// Exemplo mudando o URL tarves de query string
app.get('/products', (req, res) => {
    const query = req.query //Tras a informação que é passada no URL a seguir ao ?
    if (!query.search) { // Se não existir search vai passar a mensagem infra
        res.send({
            error: 'You must provide a search term'
        })
    } else {
        console.log(query.search)
        res.send({
            products: []
        })
    }
})*/



// Pagina 404.hbs, para URLs help/qq coisa
app.get('/help/*' , (req, res) => { 
    res.render('404', {
        title: '404',
        name: 'Sofia Sousa',
        erro: 'Help article not found'
        }
    )
})

// Pagina 404.hbs para URLs diferentes de todos os definidos acima
// No 1 arg temos que colocar * (match anything that are not configured above). Nota, este têm que vir em ultimo, pq o express vai fazendo os matches por ordem do codigo
app.get('*' , (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Sofia Sousa',
        erro: 'Page not found',
        }
    )
})




 // Método listen que permite iniciar o servidor. 
 // Primeiro parametro: Porta (neste caso 3000), segundo é uma callback function que vai devolver resposta quando for iniciado, uma vez que é assyncrono
 // Depois de definir este método podemos iniciar atraves da linha de comandos (node app.js) e ver a resposta em http://localhost:3000/
app.listen(3000, () => {
    console.log('O servidor is up on port 3000.')
})


