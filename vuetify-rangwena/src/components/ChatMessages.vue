<template>
  <div class="flex flex-col">
    <div
      class="flex"
      :class="{
        'justify-end': pos === 'right',
      }"
      :key="index"
      v-for="({ content, pos, next, prev, time }, index) in messages"
    >
      <div class="max-w-[85%] mb-1">
        <v-card
          :color="pos == 'left' ? 'primaryVariant' : undefined"
          :variant="pos == 'left' ? 'tonal' : undefined"
          :style="{
            borderTopLeftRadius: `${pos === 'right' ? (prev ? 0 : 24) : 0}px`,
            borderTopRightRadius: `${pos === 'right' ? 0 : prev ? 0 : 24}px`,
            borderBottomLeftRadius: next ? 0 : '24px',
            borderBottomRightRadius: next ? 0 : '24px',
          }"
        >
          <template #text>
            <div>
              <div>
                {{ content }}
              </div>
              <div
                :class="{
                  'justify-end': pos === 'left',
                }"
                class="flex gap-2"
              >
                <em class="text-xs font-semibold">{{
                  new Date(time).toLocaleTimeString()
                }}</em>
                <v-icon size="sm">mdi-check</v-icon>
              </div>
            </div>
          </template>
        </v-card>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ChatMessagePosition, UIChatMessage, WSChatMessage } from "@/lib/types";
import { useAuthStore } from "@/stores/store.auth";

const props = defineProps<{
  msgs: WSChatMessage[];
}>();
const { principal } = useAuthStore();

const messages = computed<UIChatMessage[]>(() => {
  return props.msgs
    .map((p) => {
      const pos: ChatMessagePosition =
        p.from === principal?.id ? "right" : "left";
      return {
        ...p,
        pos,
      };
    })
    .map((p, index, arr) => ({
      ...p,
      next:
        index !== arr.length - 1
          ? arr[index].pos === arr[index + 1].pos
          : false,
      prev: index !== 0 ? arr[index].pos === arr[index - 1].pos : false,
    }));
});
</script>
