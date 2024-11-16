<template>
  <div class="grid">
    <div class="max-w-lg border-r">
      <v-card
        v-for="(item, index) in 2"
        :key="index"
        class="mb-4 border-b"
        rounded="0"
        elevation="0"
        density="compact"
        prepend-avatar="http://localhost:8000/erick.jpg"
        subtitle="Salsa, merengue, y cumbia"
        title="Cuba"
      >
        <v-img
          height="128"
          src="https://picsum.photos/512/128?image=660"
          cover
        ></v-img>

        <v-card-text>
          During my last trip to South America, I spent 2 weeks traveling
          through Patagonia in Chile.
        </v-card-text>

        <template v-slot:actions>
          <v-btn color="primary" variant="text">View More</v-btn>

          <v-btn color="primary" variant="text">See in Map</v-btn>
        </template>
      </v-card>
    </div>
  </div>
</template>
<script setup lang="ts"></script>
<style lang="css" scoped></style>
<route lang="yaml">
meta:
  layout: index
</route>
