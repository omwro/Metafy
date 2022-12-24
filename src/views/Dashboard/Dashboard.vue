<template>
    <section>
        <h1 class="text-center text-2xl p-4">Let's vibe with Metafy!</h1>
        <QuickTools/>
        <Dynamics/>
        <Tagged/>
        <Untagged/>
    </section>
</template>

<script>
import QuickTools from "/src/components/QuickTools";
import Dynamics from "./Dynamics";
import Tagged from "./Tagged";
import Untagged from "./Untagged";

export default {
    name: "Dashboard",
    components: {Untagged, Tagged, Dynamics, QuickTools},
    data: () => ({
    })
}
</script>

<style lang="scss" scoped>
.playlist-container {
    margin: 0 12px 12px;
    padding: 8px;
    border: solid 1px white;
    border-radius: 5px;

    .playlist-container-title {
        width: 100px;
        margin-top: -10px;
        text-align: center;
        border-radius: 25px;
        border: solid 1px white;
    }

    .dynamic-card:not(:last-child) {
        border-bottom: dashed 1px white !important;
    }

    .small-chip {
        height: 20px;
        font-size: 12px;
        padding: 0 6px;
        margin-bottom: auto;
        border-color: white;
    }
}

.playlist-chip {
    margin: 4px;

    &:hover {
        .div::before {
            opacity: 0.08;
        }
    }
}

.dialogChipContainer {
    max-height: 150px;
    overflow-y: scroll;
}

.max-height {
    height: calc(100vh - 100px);
    overflow-y: auto;
}

.fitcontent {
    width: fit-content;
    margin-left: auto;
    margin: auto;
}
</style>