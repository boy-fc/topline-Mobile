<template>
  <div id="app">
    <keep-alive :exclude="['ArticleIndex']">
      <router-view/>
    </keep-alive>
  </div>
</template>

<style lang="less">
</style>
