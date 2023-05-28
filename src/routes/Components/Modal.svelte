<script>
    export let showModal = true;
</script>

{#if showModal}
    <div on:click|self class="backdrop">
        <div class="form-container">
            <slot/>
        </div>
    </div>
{/if}

<style>
    .backdrop {
        width: 100%;
        height: 100vh;
        position: absolute;
        overflow: hidden;
        padding-right: 15px;
        background-color: #555555dd;
        z-index: 2;
    }

    .form-container {
        padding: 5%;
        border-radius: 10px;
        margin: 10%;
        text-align: center;
        background-color: white;
    }
</style>
