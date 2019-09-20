import animation from 'nanoanimation'
import html from 'choo/html'
import choo from 'choo'

import devtools from 'choo-devtools'

import Koji from '@withkoji/vcc'

import { pickFromList, hexToRgba } from './utils'

const mainView = (state, emit) => {
    document.title = state.config.title;

    let { colors } = state.config
    let size = Math.min(window.innerHeight, window.innerWidth)
    let sizeTo = (ratio) => Math.round(size * ratio)

    let body = `
        margin: 0px;
        background-color: ${colors.backgroundColor};
        color: ${colors.primaryColor};
        user-select: none;
        overflow: hidden;
    `

    let stage = `
        width: 100%;
        height: 100%;
        display: inline-block;
    `

    let ball = `
        display: inline-block;
        width: ${sizeTo(0.8)}px;
        height: ${sizeTo(0.8)}px;
        margin: ${sizeTo(0.1)}px;
        border-radius: 50%;
        position: relative;
        background: radial-gradient(circle at 50% 120%, ${colors.primaryColor}, ${colors.secondaryColor} 10%, ${colors.tertiaryColor} 80%, ${colors.tertiaryColor} 100%)
    `

    let ballShadow = `
        position: absolute;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle at 50% 50%, ${hexToRgba(colors.secondaryColor, 0.4)}, ${hexToRgba(colors.secondaryColor, 0.1)} 40%, ${hexToRgba(colors.secondaryColor, 0)} 50%);
        transform: rotateX(85deg) translateZ(-${sizeTo(0.5)}px);
    `

    let messageTriangle = `
        stroke-width: 20;
        stroke: ${colors.primaryColor};
        stroke-linejoin: round;
        stroke-linecap:round;
    `

    let messageText = `
        font: sans-serif;
        stroke: white;
        stroke-width: 2px;
        text-anchor: middle;
    `

    let fadeBall = animation([
        { opacity: 1 },
        { opacity: 0.60 },
        { opacity: 1 }
    ], {
        duration: 2000
    })

    let hoverBall = animation([
        { transform: 'translateY(0%)' },
        { transform: 'translateY(-10%)' },
        { transform: 'translateY(0%)' }
    ], {
        duration: 2000
    })

    let hoverShadow = animation([
        { opacity: 1 },
        { opacity: 0.60 },
        { opacity: 1 }
    ], {
        duration: 2000,
        fill: 'forwards'
    })

    const onclick = () => {
        let ball = document.getElementById('ball')
        let shadow = document.getElementById('shadow')

        hoverShadow(shadow, null).play()
        fadeBall(ball, null).play();
        hoverBall(ball, () => {

            emit('message:new')
        }).play()

    }

    // todo: message triangle
    // <path d="M 50,10 90,90 10,90 z"/>
    let crystalBall = html `
        <figure id="ball" style=${ball} onclick=${() => onclick()}>
            <span id="shadow" style=${ballShadow}></span>
            <svg style=${messageTriangle} xmlns="http://www.w3.org/2000/svg" version="1.1" class="svg-triangle">
                <text x="112" y="125" style=${messageText}>${state.message}</text>
            </svg>
        </figure>
    `

    return html `
    <body style=${body}>
      <section style=${stage}>
        ${crystalBall}
      </section>
    </body>
  `
}

const configStore = (state) => {
    state.config = {
        title: Koji.config.settings.name,
        messages: Koji.config.settings.messages,
        colors: Koji.config.colors
    }
}

const newMessage = (state, emitter) => {
    state.message = 'Ask anything'
    emitter.on('message:new', function () {
        state.message = pickFromList(state.config.messages)
        emitter.emit('render')
    })
}

const app = choo()
app.use(devtools())
app.use(configStore)
app.use(newMessage)
app.route('/', mainView)
app.mount('body')