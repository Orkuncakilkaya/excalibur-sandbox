<script lang="ts">
    import {dispatchCraftItem} from "../events/craftState";

    function craft(item: string) {
        dispatchCraftItem({item})
    }
</script>

<style>
    .crafting-container {
        width: 400px;
        height: 200px;
        position: absolute;
        top: 300px;
        left: 90px;
        background: rgba(0, 0, 0, 0.4);
    }

    .crafting-grid {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(8, 2fr);
        gap: 4px;
        padding: 4px
    }

    .item {
        background: #fff;
        height: 32px;
    }
</style>

<div class="crafting-container">
    <div class="crafting-grid">
        <button type="button" class="item" on:click={() => craft('stoneAxe')}>
            Stone Axe
        </button>
        <button type="button" class="item" on:click={() => craft('stonePickaxe')}>
            Stone Pickaxe
        </button>
    </div>
</div>