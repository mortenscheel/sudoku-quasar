<template>
    <div class="tile flex flex-center non-selectable"
         :class="{
            top: !tile.up,
            right: !tile.right,
            left: !tile.left,
            bottom: !tile.down,
            vertical: (tile.col + 1) % 3 === 0,
            horizontal: (tile.row + 1) % 3 === 0,
            temporary: tile.temporary && !tile.value,
            'text-weight-bold': tile.value,
         }"
         :style="{
        'grid-row': tile.row + 1,
        'grid-column': tile.col + 1,
      }"
        @click.alt.prevent.stop.capture="onAltClick">
        {{ tile.value || tile.temporary || '' }}
        <q-popup-edit v-if="!preventPopup" v-model.number="tile.value">
            <q-input v-model.number="tile.value" type="number" dense autofocus style="width: 30px"/>
        </q-popup-edit>
    </div>
</template>

<script>
import Tile from '../game/SudokuTile';

export default {
  name: 'Tile',
  props: {
    tile: {
      type: Tile,
      required: true,
    },
  },
  data() {
    return {
      preventPopup: false,
    };
  },
  methods: {
    onAltClick() {
      this.$emit('alt');
      this.preventPopup = true;
      this.$nextTick(() => {
        this.preventPopup = false;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
    $edge-width: 2px;
    $edge-color: #333;
    .tile {
        width: 40px;
        height: 40px;
        border: 1px solid #ccc;
        border-top-width: 0;
        border-right-width: 0;

        &.top {
            border-top-width: $edge-width;
            border-top-color: $edge-color;
        }

        &.right, &.vertical {
            border-right-width: $edge-width;
            border-right-color: $edge-color;
        }

        &.left {
            border-left-width: $edge-width;
            border-left-color: $edge-color;
        }

        &.bottom, &.horizontal {
            border-bottom-width: $edge-width;
            border-bottom-color: $edge-color;
        }

        &.temporary{
            color: #888;
        }
    }
</style>
