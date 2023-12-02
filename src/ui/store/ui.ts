import { writable } from 'svelte/store'
import { GameScreen } from '../events/uistate'

export const gameScreen = writable(GameScreen.Loading)
