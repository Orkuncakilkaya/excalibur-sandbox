<script lang="ts">
    import {gameScreen} from "./store/ui";
    import {Keys} from "excalibur";
    import {GameScreen, onUIStateChanged, dispatchUIState} from "./events/uiState";
    import InventoryFrame from "./components/InventoryFrame.svelte";
    import CraftingFrame from "./components/CraftingFrame.svelte";

    let currentGameScreen = GameScreen.Loading;

    gameScreen.subscribe(screen => currentGameScreen = screen);

    onUIStateChanged(function (event) {
        gameScreen.set(event.detail.screen)
    })

    function onPauseClicked() {
        if (currentGameScreen === GameScreen.HUD) {
            dispatchUIState({screen: GameScreen.Pause})
        } else if(currentGameScreen === GameScreen.Pause) {
            dispatchUIState({screen: GameScreen.HUD})
        }
    }

    function onKeyDown(e) {
        if(e.key === Keys.Esc) {
            onPauseClicked()
        }
    }

    $: onHUD = currentGameScreen === GameScreen.HUD
    $: onPause = currentGameScreen === GameScreen.Pause

</script>

<style>
    .ui {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
    }
    .hud {
        display: flex;
    }

    .pause {
        display: flex;
        flex: 1;
        background: rgba(0, 0, 0, 0.4);
        width: 100%;
        height: 100%;
    }
</style>
<div class="ui">
    {#if onHUD}
        <div class="hud">
            <InventoryFrame />
            <CraftingFrame />
        </div>
    {:else if onPause}
        <div class="pause">
        </div>
    {/if}
</div>

<svelte:window on:keydown|preventDefault={onKeyDown} />