<script setup lang="ts">
const { t } = useI18n();

throw createError({
  statusCode: 404,
  statusMessage: t('error.notFound.title'),
  message: t('error.notFound.description'),
  fatal: true,
});
</script>
