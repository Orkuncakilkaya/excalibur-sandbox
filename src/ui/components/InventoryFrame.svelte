<script lang="ts">
    import {inventoryStore} from "../store/inventory";
    let inventory;
    inventoryStore.subscribe(inv => inventory = inv)
</script>

<style>
    .inventory-container {
        width: 400px;
        height: 200px;
        position: absolute;
        top: 90px;
        left: 90px;
        background: rgba(0, 0, 0, 0.4);
    }

    .inventory-grid {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(8, 2fr);
        gap: 4px;
        padding: 4px
    }

    .item {
        background: #fff;
        height: 32px;
        border: 0;
        outline: 0;
    }
</style>

<div class="inventory-container">
    <div class="inventory-grid">
        {#each inventory.container as item}
            <div class="item">
                <span>{item.name}</span>
                <span>{item.stack}</span>
            </div>
        {/each}
    </div>
    <progress value={inventory.weight} max={inventory.maxWeight} />
</div>