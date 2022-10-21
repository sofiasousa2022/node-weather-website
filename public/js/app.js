const weatherForm = document.querySelector('form') // Permite manipular o elemento form ou interagir com o que é colocado no form
const search = document.querySelector('input') // Permite obter o valor do input
const messageOne = document.querySelector('#message-1') // Queremos manipular o elemento p mas um especifico, pelo que lhe demos um id (no html) e aqui vamos referencialo
const messageTwo = document.querySelector('#message-2')

messageOne.textContent = '' // Vai apresentar este valor porque o form ainda não foi preenchido 
messageTwo.textContent = ''

weatherForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const location = search.value //Vamos guardar o valor numa variavel

    // Queremos que só submeta o fetch quando não há erros e queremos passar a location no URL
    fetch ('/weather?address='+location).then ((response)=> { // A resposta do fetch entra neste response
        response.json().then ((data)=>{  // Com a responde podemos utilziar o metodo response.json que vai transformar em parse a resposta (que estava em json) e depois a função callback vai receber os valores
            if (data.erro) { 
                messageOne.textContent = data.erro
                messageTwo.textContent = ''
            } else {
                messageOne.textContent = data.location // Apresentar no html o valor dado pelo js
                messageTwo.textContent = data.forecast 
                }
            })
        })
})

