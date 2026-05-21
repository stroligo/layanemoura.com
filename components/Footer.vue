<template>
  <footer class="site-footer">
    <div class="container-fluid wrap">
      <div
        class="flex flex-col gap-10 md:flex-row md:items-start md:justify-between"
      >
        <div>
          <SiteLogo variant="footer" />
          <p class="mt-4 max-w-sm font-body text-sm leading-relaxed text-on-forest/85">
            {{ description }}
          </p>
        </div>

        <div class="flex flex-col gap-6 md:items-end">
          <SocialLinks variant="footer" />
          <ul class="space-y-2 font-sans text-sm">
            <li>
              <a :href="`mailto:${site.email}`">{{ site.email }}</a>
            </li>
            <li>
              <a href="https://layanemoura.com" target="_blank" rel="noopener">
                layanemoura.com
              </a>
            </li>
            <li class="text-on-forest/75">{{ t('footer.nomad') }}</li>
          </ul>
        </div>
      </div>

      <div class="divider-organic mt-12 opacity-40" role="presentation" />

      <p class="mt-8 text-center font-sans text-xs text-on-forest/70 md:text-left">
        {{ t('footer.rights', { year, name: site.name }) }}
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { site } from '~/data/site';

const { t } = useI18n();
const { description } = useSiteContent();

const year = new Date().getFullYear();
</script>
