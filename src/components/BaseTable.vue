<template>
  <div class="base-table">
    <div class="base-table__header">
      <slot name="header" />
    </div>

    <div class="base-table__body">
      <slot name="body" />
    </div>
  </div>
</template>

<style lang="scss">
.base-table {
  border: 1px solid #ECEFF0;
  border-radius: 8px;

  h3 {
    margin: 0;
  }

  &__header {
    border-bottom: 1px solid #ECEFF0;
    padding: 8px 16px;
  }
}
</style>
