<script setup>
import { ref, computed, onMounted } from 'vue'
import Timer from '../components/timers/Timer.vue'

// ref: https://stackoverflow.com/questions/52067287/how-to-create-a-dynamic-grid-using-vue

const timers = ref([
  //   {
  //     id: 0,
  //     title: 'Item A'
  //   },
  //   {
  //     id: 1,
  //     title: 'Item B'
  //   },
  //   {
  //     id: 2,
  //     title: 'Item C'
  //   }
])

//Drop Zones
const dropZones = ref([])

//Seed the Grid with DropZones
onMounted(() => {
  for (let i = 0; i < 64; i++) {
    dropZones.value.push({
      id: i,
      gridPosId: i + 1,
      timer: []
    })
  }
})

const listOfTimers = computed(() => {
  let list = []
  timers.value.map((timer) => list.push([`${timer.id}:${timer.gridPosId}`]))
  return list
})

const listOfZones = computed(() => {
  let list = []
  dropZones.value.map((zone) =>
    zone.timer.gridPosId
      ? list.push([`${JSON.stringify(zone.timer.id)},${JSON.stringify(zone.timer.gridPosId)}`])
      : list.push([])
  )
  return list
})

const showDropZones = ref(false)

const startingTimer = ref()
const holdTimer = ref()
const endingTimer = ref()

const startingZone = ref()
const endingZone = ref([])

const startDrag = (evt, dragItem) => {
  //Create a copy of the starting obect as to not keep reactivity
  startingTimer.value = JSON.parse(JSON.stringify(dragItem))

  let startTimer = timers.value.find((timer) => timer.id == dragItem.id)
  let startingTimerZoneId = startTimer.gridPosId

  holdTimer.value = startTimer

  startingZone.value = dropZones.value.find((zone) => zone.id == startingTimerZoneId - 1)

  console.log(`startingZone: ${JSON.stringify(startingZone.value)}`)

  evt.dataTransfer.dropEffect = 'move'
  evt.dataTransfer.effectAllowed = 'move'
  evt.dataTransfer.setData('itemID', dragItem.id)

  showDropZones.value = true
}

const onDragOver = (evt) => {
  evt.preventDefault()
  evt.dataTransfer.dropEffect = 'move'
}

const onDragEnter = (evt) => {
  if (evt.target.closest('.drop-zone')) {
    evt.target.closest('.drop-zone').classList.add('dragover')
  }
}

const onDragLeave = (evt) => {
  if (evt.target.closest('.drop-zone')) {
    evt.target.closest('.drop-zone').classList.remove('dragover')
  }
}

const onDrop = (evt, dropZone) => {
  //Keep track of destination timer
  let tempTimer = JSON.parse(JSON.stringify(dropZone.timer))
  // console.log(`tempTimer: ${JSON.stringify(tempTimer)}`)
  console.log(`startingTimer: ${JSON.stringify(startingTimer.value)}`)
  console.log(`dropZone: ${JSON.stringify(dropZone)}`)
  console.log(`dropZone.timer: ${JSON.stringify(dropZone.timer)}`)

  //Add dragged Timer to destination dropZone
  dropZone.timer = startingTimer.value

  //Overwrite source timer with destination timer
  let sourceDropZone = dropZones.value.find(
    (zone) => zone.gridPosId == startingZone.value.gridPosId
  )

  if (sourceDropZone && Object.keys(sourceDropZone.timer).length > 0) {
    console.log('timer found', sourceDropZone.timer)

    // sourceDropZone.timer = tempTimer
    sourceDropZone.timer = holdTimer.value
  } else {
    console.log('no timer found', sourceDropZone.timer)
    sourceDropZone.timer = []
  }

  // sourceDropZone.timer = tempTimer

  // endingTimer.value = startingTimer.value
  // console.log(JSON.stringify(tempTimer))
  // endingTimer.value = tempTimer

  showDropZones.value = false
}

//Dynamic Grid Columns
const numColumns = ref(5)

const gridStyle = computed(() => {
  return { gridTemplateColumns: `repeat(${numColumns.value}, minmax(50px, 1fr))` }
})

var timersLength = computed(() => {
  return timers.value.length
})

var dropZoneLength = computed(() => {
  return dropZones.value.length
})

//Add Timer
const addItem = () => {
  const newId = timersLength.value + 1

  if (firstEmptyZone.value == null) {
    let newTimer = {
      id: dropZoneLength.value + 1,
      timer: {
        id: newId,
        title: `Timer ${newId}`
      }
    }
    timers.value[timers.value.length] = newTimer
    dropZones.value[dropZones.value.length] = newTimer
    return
  }

  const zone = dropZones.value.find((zone) => zone.id == firstEmptyZone.value)

  var newTimer = {
    id: newId,
    gridPosId: zone.id + 1,
    title: `Timer ${zone.id + 1}`
  }

  timers.value[timers.value.length] = newTimer
  dropZones.value[zone.id].timer = newTimer
}

//Delete Timer
const deleteItem = (timerId) => {
  let dropZone = dropZones.value.find((zone) => zone.timer.id === timerId)
  dropZone.timer = []

  let timerIdx = timers.value.find((timer) => timer.id == timerId)
  timers.value.splice(timerIdx, 1)
}

//FirstEmptyDropZone
const firstEmptyZone = computed(() => {
  return dropZones.value.find((zone) => zone.timer && zone.timer.length == 0)
    ? dropZones.value.find((zone) => zone.timer && zone.timer.length == 0).id
    : null
})
</script>

<template>
  <div>
    <h4>FirstEmptyZone: {{ firstEmptyZone }}</h4>
    <h4>DropZoneLength: {{ dropZoneLength }}</h4>
    <h4>TimersLength: {{ timersLength }}</h4>

    <h4>HoldTimer: {{ holdTimer }}</h4>

    Timers: {{ listOfTimers }}
    <br />
    Zones: {{ listOfZones }}
    <!-- <div style="height: 500px">
      <pre>StartingTimer: {{ startingTimer }}</pre>
      <pre>EndingTimer: {{ endingTimer }}</pre>
      <pre>StartingZone: {{ startingZone }}</pre>
      <pre>EndingZone: {{ endingZone }}</pre>
    </div> -->

    <div class="column-select">
      <label for="">Columns:</label>
      <select v-model="numColumns">
        <option v-for="n in 8" :key="n" :value="n">{{ n }}</option>
      </select>
    </div>

    <ul class="drop-grid" :style="gridStyle">
      <div
        v-for="dropZone in dropZones"
        :key="dropZone"
        :id="dropZone.id"
        class="drop-zone"
        :class="{ outline: showDropZones }"
        @drop="onDrop($event, dropZone)"
        @dragover="onDragOver($event)"
        @dragenter="onDragEnter($event)"
        @dragleave="onDragLeave($event)"
      >
        <span style="font-size: 12px; position: absolute; margin-top: -170px">{{
          dropZone.timer
        }}</span>
        <!-- <span style="position: absolute; margin-top: -170px">posID: {{ dropZone.gridPosId }}</span> -->
        <template v-if="dropZone.timer && JSON.stringify(dropZone.timer) != '[]'">
          <Timer
            :timer="dropZone.timer"
            draggable
            @dragstart="startDrag($event, dropZone.timer)"
            @close="deleteItem"
          />
        </template>
        <template v-else-if="dropZone.id == firstEmptyZone">
          <span @click="addItem" class="add-timer-button">+</span>
        </template>
        <template v-else>
          DropZone:
          {{ dropZone.id }}
        </template>
      </div>
    </ul>
  </div>
</template>
<style scoped>
ul {
  list-style-type: none;
}
.drag-el {
  background-color: #fff;
  margin-bottom: 10px;
  padding: 5px;
  cursor: pointer;
}

.drop-grid {
  display: grid;
  grid-gap: 1em;
  /* grid-template-columns: repeat(8, 1fr); */
  /* grid-template-rows: repeat(auto-fill, 200px); */
  /* grid-auto-rows: auto; */
  /* outline: 1px solid red; */
  width: 80vw;
  margin: 0 auto;
  padding: 20px;
}

.drop-zone {
  position: relative;
  aspect-ratio: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1em;
}

.dragover {
  outline: 4px dashed lime !important;
}

.outline {
  outline: 1px dashed black;
}

.column-select {
  margin: 0 auto;
  text-align: center;
  display: block;
}

.timer-container {
  width: 200px;
  height: 400px;
  overflow: auto;
  position: relative;
}

.add-timer-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  display: flex;
  font-size: 46px;
  font-weight: bold;
  cursor: pointer;
}

.add-timer-button:hover {
  background-color: rgb(148, 144, 144);
}
</style>
