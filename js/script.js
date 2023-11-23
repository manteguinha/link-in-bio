const html = document.documentElement
const typewriterElement = document.querySelector('.typewriter')

const img = document.querySelector('#profile img')

const url_img_perfil_dark = 'https://avatars.githubusercontent.com/u/63943591?v=4'
const url_img_perfil_light = 'https://avatars.githubusercontent.com/u/63943591?v=4'

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    img.setAttribute('src', url_img_perfil_light)
} else {
    img.setAttribute('src', url_img_perfil_dark)
}

if (typewriterElement) {
    const linguagens_inicio = typewriterElement.innerHTML
    typewriterElement.innerHTML = ''

    typeWriter(linguagens_inicio, 0)
}

window.matchMedia('(prefers-color-scheme: light)').addListener(event => {
    const theme = event.matches ? 'light' : 'dark'

    if (theme === 'light') {
        img.setAttribute('src', url_img_perfil_light)
    } else {
        img.setAttribute('src', url_img_perfil_dark)
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
        img.setAttribute('src', url_img_perfil_light)
    } else {
        html.classList.remove('lightTheme')
        html.classList.add('darkTheme')
        setTheme('dark')
        img.setAttribute('src', url_img_perfil_dark)
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = getTheme()

    if (savedTheme === null) {
        // Caso não haja tema salvo, define o tema escuro como padrão
        html.classList.add('darkTheme')
        img.setAttribute('src', url_img_perfil_dark)
        setTheme('dark') // Define o tema escuro no localStorage
    } else if (savedTheme === 'dark') {
        html.classList.add('darkTheme')
        img.setAttribute('src', url_img_perfil_dark)
    } else {
        html.classList.add('lightTheme')
        img.setAttribute('src', url_img_perfil_light)
    }
})

function share() {
    try {
        if (navigator.share) {
            navigator.share({
                title: 'Marcos Vinicius | MVMS',
                text: "//Maybe, perhaps, I don't know",
                url: 'https://bio.mvms.dev',
            })

            console.info('Você compartilhou omeu link! Obrigado! :)')
        } else {
            alert('Poxa, parece que seu navegador não suporta a API de compartilhamento da Web! :(')
        }
    } catch (error) {
        console.error(`Ocorreu um erro ao compartilhar o link: ${error.message}`)
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
            const responseData = await response.json()

            if (responseData.tocandoAgora === 'true') {
                // Verifica se o link atual é diferente do link obtido
                if (responseData.link !== currentLink) {
                    currentLink = responseData.link // Atualiza o link atual
                    updateSpotifyCard(responseData)
                }
            } else {
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
    const localOuvinhoSpotify = document.getElementById('ouvindoSpotify')

    // atualiza os campos do html
    localNomeMusica.innerHTML = nomeMusica
    localNomeArtista.innerHTML = nomeArtista
    localImagemAlbum.src = imagemAlbum
    localOuvinhoSpotify.innerHTML = 'Ouvindo no Spotify'
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

const clockElement = document.getElementById('clock')

function updateTime() {
    const now = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
    const [day, month, year] = now.split(' ')[0].split('/')
    const [hours, minutes, seconds] = now.split(' ')[1].split(':')

    const eventos = {
        natal: {
            data: '25/12',
            mensagem: 'Feliz Natal!',
            icone: '🎄',
        },
        anoNovo: {
            data: '01/01',
            mensagem: 'Feliz Ano Novo!',
            icone: '<i class="fas fa-champagne-glasses"></i>',
        },
    }

    const dateString = `${day} de ${months[parseInt(month) - 1]} de ${year.replace(',', '')}`
    const timeString = `${hours}:${minutes}:${seconds}`

    let icone = '<i class="fa-regular fa-clock"></i>'
    let eventMessage = ''
    let iconEvent = ''

    // Verifica se a data atual corresponde a algum evento e define a mensagem e o ícone do evento
    Object.keys(eventos).forEach(evento => {
        if (eventos[evento].data === `${day}/${month}`) {
            eventMessage = eventos[evento].mensagem
            iconEvent = eventos[evento].icone
        }
    })

    if (parseInt(hours) >= 0 && parseInt(hours) < 6) {
        icone = '<div id="snooze-icon"></div>'
    }

    clockElement.style.cssText = 'font-size: 14px; margin-bottom: 5px;'
    clockElement.innerHTML = `${icone} ${dateString} • ${timeString} ${
        eventMessage ? `— <span><strong>${eventMessage}</strong> ${iconEvent}</span>` : ''
    }`
}

function fetchWeather() {
    fetch('https://wttr.in/Goi%C3%A1s?format=%25c%0A%25t%0A%25C%0A%25l')
        .then(response => response.text())
        .then(data => {
            const weatherElement = document.getElementById('weather')
            const lines = data.trim().split('\n') // Separa os dados por quebras de linha e remove espaços em branco

            const weatherIcons = {
                '☀️': 'fas fa-sun', // Ensolarado
                '🌤️': 'fas fa-cloud-sun', // Parcialmente nublado
                '⛅': 'fas fa-cloud', // Nublado
                '🌥️': 'fas fa-cloud-sun', // Parcialmente nublado
                '🌦️': 'fas fa-cloud-sun-rain', // Possibilidade de chuva
                '🌧️': 'fas fa-cloud-showers-heavy', // Chuvoso
                '⛈️': 'fas fa-poo-storm', // Tempestade
                '🌩️': 'fas fa-bolt', // Trovão
                '🌨️': 'fas fa-snowflake', // Nevando
                '❄️': 'fas fa-snowflake', // Nevando
                '🌫️': 'fas fa-smog', // Nevoeiro
                '🌬️': 'fas fa-wind', // Ventoso
                '☁️': 'fas fa-cloud', // Nuvens
                '🌫': 'fas fa-smog', // Nevoeiro
                '🌦': 'fas fa-cloud-sun-rain', // Possibilidade de chuva
                '🌩': 'fas fa-bolt', // Trovão
                '🌨': 'fas fa-snowflake', // Nevando
                '🌧': 'fas fa-cloud-showers-heavy', // Chuvoso
                '⛈': 'fas fa-poo-storm', // Tempestade
            }

            const icon = lines[0].trim() // Ícone da condição
            const temperature = lines[1] // Temperatura
            const condition = lines[2] // Condição
            const location = lines[3] // Local

            const weatherIcon = weatherIcons[icon] || 'fas fa-temperature-half'

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
            const formattedHTML = `<i class="${weatherIcon}"></i> Atualmente está <strong>${modifiedTemperature}</strong> ${styledCondition} em <strong>${location}</strong>.`

            weatherElement.innerHTML = formattedHTML
        })
        .catch(error => {
            console.error('Erro ao buscar dados do clima:', error)
        })
}

updateTime()
setInterval(updateTime, 1000)

fetchData()
setInterval(fetchData, 10000)

fetchWeather()
setInterval(fetchWeather, 10000)
