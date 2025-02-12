<script setup>
import {header, showBackButton, tabs} from "../header.js";
import {TabList} from "primevue";
import {ref} from "vue";
</script>

<template>

  <div>
    <Tabs :value="$route.name" v-if="tabs.length > 0" scrollable>
      <TabList>
        <router-link v-for="tab in tabs" v-slot="{ href, navigate }" :to="tab.route">
          <Tab :value="tab.route.name">
            <a :href="href" @click="navigate">
              <span>{{ tab.title }}</span>
            </a>
          </Tab>
        </router-link>
      </TabList>
    </Tabs>
  </div>
</template>

<style scoped>
</style>