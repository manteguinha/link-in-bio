const html = document.documentElement
const typewriterElement = document.querySelector('.typewriter')

const img = document.querySelector('#profile img')

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    img.setAttribute('src', 'https://avatars.githubusercontent.com/u/63943591?v=4')
} else {
    img.setAttribute('src', 'https://avatars.githubusercontent.com/u/63943591?v=4')
}

if (typewriterElement) {
    const linguagens_inicio = typewriterElement.innerHTML
    typewriterElement.innerHTML = ''

    typeWriter(linguagens_inicio, 0)
}

window.matchMedia('(prefers-color-scheme: light)').addListener(event => {
    const theme = event.matches ? 'light' : 'dark'

    if (theme === 'light') {
        img.setAttribute('src', 'https://avatars.githubusercontent.com/u/63943591?v=4')
    } else {
        img.setAttribute('src', 'https://avatars.githubusercontent.com/u/63943591?v=4')
    }
})

// Função para obter o tema atual
function getTheme() {
    return localStorage.getItem('theme')
}

// Função para definir o tema atual
function setTheme(theme) {
    localStorage.setItem('theme', theme)
}

// Função para alternar entre temas
function switchTheme() {
    const currentTheme = getTheme()

    if (currentTheme === 'dark') {
        html.classList.remove('darkTheme')
        html.classList.add('lightTheme')
        setTheme('light')
        img.setAttribute('src', 'https://avatars.githubusercontent.com/u/63943591?v=4')
    } else {
        html.classList.remove('lightTheme')
        html.classList.add('darkTheme')
        setTheme('dark')
        img.setAttribute('src', 'https://avatars.githubusercontent.com/u/63943591?v=4')
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = getTheme()

    if (savedTheme === null) {
        // Caso não haja tema salvo, define o tema escuro como padrão
        html.classList.add('darkTheme')
        img.setAttribute('src', 'https://avatars.githubusercontent.com/u/63943591?v=4')
        setTheme('dark') // Define o tema escuro no localStorage
    } else if (savedTheme === 'dark') {
        html.classList.add('darkTheme')
        img.setAttribute('src', 'https://avatars.githubusercontent.com/u/63943591?v=4')
    } else {
        html.classList.add('lightTheme')
        img.setAttribute('src', 'https://avatars.githubusercontent.com/u/63943591?v=4')
    }
})

function share() {
    try {
        if (navigator.share) {
            navigator.share({
                title: 'Marcos Vinicius | MVMS',
                url: 'https://bio.mvms.dev',
            })

            console.info('You have shared the link successfully!')
        } else {
            alert('Poxa, parece que seu navegador não suporta a API de compartilhamento da Web! :(')
        }
    } catch (error) {
        console.error(`An error occured while using the Web share API!\nError: ${error}`)
    }
}

function typeWriter(linguagens_inicio, i) {
    if (i < linguagens_inicio.length) {
        typewriterElement.innerHTML += linguagens_inicio.charAt(i)
        setTimeout(() => typeWriter(linguagens_inicio, i + 1), 50)
    }
}

let currentLink = '' // Variável para armazenar o link atual obtido da API
const defaultLink = 'https://open.spotify.com/embed/track/08mG3Y1vljYA6bvDt4Wqkj?utm_source=generator&theme=0'

async function fetchData() {
    try {
        const response = await fetch('https://link-in-bio-api.manteguinha.repl.co/musguinha')
        if (response.ok) {
            console.log('Dados obtidos com sucesso!')
            const responseData = await response.json()

            if (responseData.tocandoAgora === 'true') {
                // Verifica se o link atual é diferente do link obtido
                if (responseData.linkSpotify !== currentLink) {
                    currentLink = responseData.linkSpotify // Atualiza o link atual
                    updateSpotifyCard(responseData)
                } else {
                    console.log('Link da API não foi alterado. Não é necessário atualizar.')
                }
            } else {
                console.log('Nenhuma música está sendo reproduzida.')
                if (currentLink !== defaultLink) {
                    currentLink = defaultLink
                    updateSpotifyCardDefault()
                }
            }
        } else {
            console.error('Erro ao obter os dados:', response.status)
        }
    } catch (error) {
        console.error('Erro ao realizar a requisição:', error.message)
    }
}

function updateSpotifyCard(responseData) {
    const spotifyLink = responseData.linkSpotify
    const nomeMusica = responseData.nome
    const nomeArtista = responseData.artista
    const imagemAlbum = responseData.imagem

    const localNomeMusica = document.getElementById('nomeMusica')
    const localNomeArtista = document.getElementById('nomeBanda')
    const localImagemAlbum = document.getElementById('imagemAlbum')

    // atualiza os campos do html
    localNomeMusica.innerHTML = nomeMusica
    localNomeArtista.innerHTML = nomeArtista
    localImagemAlbum.src = imagemAlbum
}

function updateSpotifyCardDefault() {
    const localNomeMusica = document.getElementById('nomeMusica')
    const localNomeArtista = document.getElementById('nomeBanda')
    const localImagemAlbum = document.getElementById('imagemAlbum')
    const localOuvinhoSpotify = document.getElementById('ouvindoSpotify')

    localNomeMusica.innerHTML = 'Back in Black'
    localNomeArtista.innerHTML = 'AC/DC'
    localOuvinhoSpotify.innerHTML = 'Spotify'
    localImagemAlbum.src = 'https://lastfm.freetls.fastly.net/i/u/174s/678ee60bb2f93f3e7a6c23e1853210da.jpg'
}

function transformSpotifyLink(linkSpotify) {
    const hasTrack = linkSpotify.includes('/track/')
    if (hasTrack) {
        const parts = linkSpotify.split('/track/')
        const trackId = parts[1]
        return `https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`
    }
    return null
}

// fetchData()
// setInterval(fetchData, 60000)

function updateTime() {
    const months = [
        'janeiro',
        'fevereiro',
        'março',
        'abril',
        'maio',
        'junho',
        'julho',
        'agosto',
        'setembro',
        'outubro',
        'novembro',
        'dezembro',
    ]

    const options = { timeZone: 'America/Sao_Paulo' } // Definindo o fuso horário para Brasília
    const now = new Date().toLocaleString('pt-BR', options)
    const [datePart, timePart] = now.split(', ') // Dividindo a data e a hora

    const [day, monthIndex, year] = datePart.split('/')
    const month = months[parseInt(monthIndex) - 1]

    const [time, period] = timePart.split(' ')
    const [hours, minutes, seconds] = time.split(':')

    const dateString = `${day} de ${month} de ${year}`
    const timeString = `${hours}:${minutes}:${seconds}`

    const clockElement = document.getElementById('clock')
    let icone = '<i class="fa-regular fa-clock"></i>'
    if (parseInt(hours) >= 0 && parseInt(hours) < 6) {
        icone = '<div id="snooze-icon"></div>'
    }

    clockElement.style.fontSize = '14px'
    clockElement.style.marginBottom = '5px'

    clockElement.innerHTML = icone + ' ' + dateString + ' • ' + timeString
}

function fetchWeather() {
    fetch('https://wttr.in/Goi%C3%A1s?format=%25c%0A%25t%0A%25C%0A%25l')
        .then(response => response.text())
        .then(data => {
            const weatherElement = document.getElementById('weather')
            const lines = data.trim().split('\n') // Separa os dados por quebras de linha e remove espaços em branco

            const icon = lines[0] // Ícone da condição
            const temperature = lines[1] // Temperatura
            const condition = lines[2] // Condição
            const location = lines[3] // Local

            const emoji = temperature.includes('°C')
                ? parseInt(temperature, 10) > 35
                    ? '🔥 '
                    : parseInt(temperature, 10) < 20
                    ? '❄️ '
                    : ''
                : ''
            const modifiedTemperature = temperature.replace('+', emoji)

            weatherElement.style.fontSize = '14px'
            weatherElement.style.marginBottom = '5px'

            // Manipula o HTML para colocar a temperatura e a cidade em negrito
            const styledCondition = `<span style="font-size: 12px; font-family: 'Courier New', monospace; font-weight: 500;">(${condition})</span>`

            // Manipula o HTML para colocar a temperatura e a cidade em negrito, e a condição com uma fonte menor
            const formattedHTML = `${icon} Atualmente está <strong>${modifiedTemperature}</strong> ${styledCondition} em <strong>${location}</strong>.`

            weatherElement.innerHTML = formattedHTML
        })
        .catch(error => {
            console.error('Erro ao buscar dados do clima:', error)
        })
}

// Restante do código permanece igual

function updateTimeAndWeather() {
    updateTime() // Chama a função para exibir a hora atualizada
    fetchWeather() // Busca e exibe o clima
}

// Atualiza o relógio e o clima a cada segundo
setInterval(updateTimeAndWeather, 1000)

// Chama updateTimeAndWeather uma vez para mostrar a hora e o clima imediatamente ao carregar a página
updateTimeAndWeather()
