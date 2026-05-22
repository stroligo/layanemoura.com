<template>
  <footer class="site-footer">
    <div class="container-fluid wrap">
      <div class="site-footer__grid">
        <div class="site-footer__brand-col">
          <div class="flex items-start justify-start">
            <SiteLogo variant="footer" />
          </div>
          <div class="site-footer__legal">
            <p class="site-footer__legal-line">
              {{ t('footer.rights', { year, name: site.name }) }}
            </p>
            <p class="site-footer__legal-line">
              {{ t('footer.developmentBy') }}
              <a
                href="https://stroligo.dev"
                target="_blank"
                rel="noopener noreferrer"
                :aria-label="t('a11y.externalLink', { label: 'stroligo.dev' })"
              >
                stroligo.dev
              </a>
            </p>
          </div>
        </div>

        <div class="site-footer__aside">
          <NuxtLink :to="localePath('/get-in-touch')" class="btn-primary site-footer__cta">
            {{ t('nav.getInTouch') }}
          </NuxtLink>
          <SocialLinks variant="footer" />
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { site } from '~/data/site';

const { t } = useI18n();
const localePath = useLocalePath();

const year = new Date().getFullYear();
</script>
