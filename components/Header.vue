<template>
  <header id="topBar" class="top-bar" :class="{ 'top-bar--compact': isCompact }">
    <nav class="top-bar-nav container-fluid wrap" :aria-label="t('nav.mainAria')">
      <span class="top-bar-spacer" aria-hidden="true" />
      <SiteLogo />
      <LangSwitcher />
    </nav>
  </header>
</template>

<script setup lang="ts">
const { t } = useI18n();
const { isCompact } = useNavCompact();
</script>
