import { writable } from 'svelte/store'
import { GameScreen } from '../events/uiState'

export const gameScreen = writable(GameScreen.Loading)
