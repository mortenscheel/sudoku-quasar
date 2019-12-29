<template>
    <q-page class="flex flex-center">
        <q-card class="shadow-0">
            <div class="q-mb-sm">
                <div class="flex items-center justify-between" v-if="started">
                    <div style="font-family: monospace">{{ elapsed }} s.</div><div>{{ board.calls }} tried</div>
                </div>
                <div v-else class="text-center">Set up the board and press Solve</div>
            </div>
            <div class="board shadow-6">
                <template v-for="tiles in board.getRows()">
                    <template v-for="tile in tiles">
                        <tile :tile="tile" :key="`${tile.row}-${tile.col}`"
                              @alt="onAltClick(tile)"/>
                    </template>
                </template>
            </div>
            <q-card-actions align="center" class="q-mt-sm">
                <q-btn
                        v-if="board && !board.solved"
                        outline
                        color="grey-8"
                        label="Solve"
                        @click="start"/>
              <q-btn
                      v-if="board && board.calls"
                      outline
                      :color="board.solved ? 'positive' : 'negative'"
                      @click="stop">
                <div v-if="board.solved">Solution found</div>
                <div v-else>Stop</div>
              </q-btn>
            </q-card-actions>
        </q-card>
    </q-page>
</template>

<script>
  /* eslint-disable no-console */

  import Board from '../game/SudokuBoard';
  import Tile from '../components/Tile';

  export default {
    name: 'PageIndex',
    components: { Tile },
    data() {
      return {
        board: null,
        started: null,
        elapsed: null,
        timer: null,
      };
    },
    watch: {
        'board.solved'(solved){
          if (solved) {
            this.stop();
          }
        }
    },
    created() {
      this.initBoard();
    },
    methods: {
      start() {
        this.started = Date.now();
        this.elapsed = 0;
        this.timer = setInterval(() => {
            this.elapsed = Number((Date.now() - this.started) / 1000).toFixed(2);
        }, 100);
        board.solve();
      },
      stop() {
        board.stop = true;
        clearInterval(this.timer);
      },
      initBoard() {
        const board = new Board();
        // board.setValues([
        //   0, 0, 0, 0, 0, 0, 2, 0, 0,
        //   0, 8, 0, 0, 0, 7, 0, 9, 0,
        //   6, 0, 2, 0, 0, 0, 5, 0, 0,
        //   0, 7, 0, 0, 6, 0, 0, 0, 0,
        //   0, 0, 0, 9, 0, 1, 0, 0, 0,
        //   0, 0, 0, 0, 2, 0, 0, 4, 0,
        //   0, 0, 5, 0, 0, 0, 6, 0, 3,
        //   0, 9, 0, 4, 0, 0, 0, 7, 0,
        //   0, 0, 6, 0, 0, 0, 0, 0, 0,
        // ]);
        this.board = board;
        global.board = board;
      },
      onAltClick(tile) {
        console.log('used', this.board.getUsedNumbers(tile));
      },
    },
  };
</script>
<style scoped>
    .board {
        display: grid;
    }
</style>
