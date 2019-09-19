/**
 * index.js
 */

import animation from 'nanoanimation'
import html from 'choo/html'
import choo from 'choo'

import devtools from 'choo-devtools'

import Koji from '@withkoji/vcc'

import { map, pickFromList } from './utils'

const mainView = (state, emit) => {
    let { colors } = state.config;

    let body = `
        background-color: ${colors.backgroundColor};
        color: ${colors.primaryColor};
        user-select: none;
        overflow: hidden;
    `

    let stage = `
        width: 75vw;
        height: 75vw;
        display: inline-block;
        margin: 1em;
        perspective: 1200px;
        perspective-origin: 50% 50%;
    `

    let ball = `
        display: inline-block;
        width: 100%;
        height: 100%;
        margin: 0;
        border-radius: 50%;
        position: relative;
        background: radial-gradient(circle at 50% 120%, ${colors.primaryColor}, ${colors.secondaryColor} 10%, ${colors.tertiaryColor} 80%, ${colors.tertiaryColor} 100%)
    `

    let ballShadow = `
        position: absolute;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.1) 40%, rgba(0, 0, 0, 0) 50%);
        transform: rotateX(85deg) translateZ(-150px);
    `

    let message = `
        width: 0;
        height: 0;
        border-left: 50px solid transparent;
        border-right: 50px solid transparent;
        border-bottom: 100px solid ${colors.tertiaryColor};
        margin: 30%;
        background: radial-gradient(circle at 50% 50%, #208ab4 0%, #6fbfff 30%, #4381b2 100%);
        transform: translateX(68px) translateY(-60px) skewX(15deg) skewY(2deg);
        position: absolute;
    `

    let bounce = animation([
        { transform: 'translateY(0%)' },
        { transform: 'translateY(-10%)' },
        { transform: 'translateY(0%)' }
    ], {
        duration: 500,
        fill: 'forwards'
    })

    let reveal = animation([
        { opacity: 0 },
        { opacity: 1 }
    ], {
        duration: 500,
        fill: 'forwards'
    })

    const onclick = (e) => {
        bounce(e.target, () => {
            console.log('bounce')
        }).play()

        reveal(e.target, () => {
            console.log('reveal')
        }).play()

        emit('message:new')
    }

    return html `
    <body style=${body}>
      <section style=${stage}>
        <figure style=${ball} onclick=${onclick}>
            <span style=${ballShadow}></span>
            <span style=${message}>${state.message}</span>
        </figure>
      </section>
    </body>
  `
}

const configStore = (state) => {
    state.config = {
        title: Koji.config.settings.name,
        fontFamily: Koji.config.settings.fontFamily,
        messages: Object.entries(Koji.config.settings)
            .filter(entry => entry[0].includes('message'))
            .map(entry => entry[1]),
        colors: Koji.config.colors
    }
}

const newMessage = (state, emitter) => {
    state.message = ''
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