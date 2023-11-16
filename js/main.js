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

function switchTheme() {
    html.classList.toggle('lightTheme')

    if (html.classList.contains('lightTheme')) {
        img.setAttribute('src', 'https://avatars.githubusercontent.com/u/63943591?v=4')
    } else {
        img.setAttribute('src', 'https://avatars.githubusercontent.com/u/63943591?v=4')
    }
}

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
