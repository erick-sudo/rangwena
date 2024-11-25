<template>
  <div>
    <div class="flex" @click="toggle">
      <div>
        <slot :expanded :expand :collapse name="prepend-summary"></slot>
      </div>
      <div class="flex-grow">
        <slot :expanded :expand :collapse name="summary"></slot>
      </div>
      <div><slot :expanded :expand :collapse name="append-summary"></slot></div>
      <div>
        <slot
          name="expand-more-icon"
          :expand
          :collapse
          :expanded
          :rotation="expanded ? 90 : 0"
          ><v-icon
            :style="{
              transform: `rotate(${expanded ? 90 : 0}deg)`,
              transitionDuration: '0.3s',
            }"
            >mdi-chevron-right</v-icon
          ></slot
        >
      </div>
    </div>
    <div
      v-show="expanded"
      class="flex duration-500"
      :class="{
        'h-max opacity-100': expanded,
        'h-0 opacity-0': !expanded,
      }"
    >
      <div>
        <slot :expanded :expand :collapse name="prepend-details"></slot>
      </div>
      <div class="flex-grow">
        <slot :expanded :expand :collapse name="default"></slot>
      </div>
      <div><slot :expanded :expand :collapse name="append-details"></slot></div>
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{
  expand?: boolean;
}>();

const expanded = ref(!!props.expand);

const toggle = () => {
  expanded.value = !expanded.value;
};

const expand = () => {
  expanded.value = true;
};

const collapse = () => {
  expanded.value = false;
};
</script>
