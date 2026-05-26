import type { ServicesCollectionItem } from '@nuxt/content';
import { servicesFallback } from '~/data/services';
import type { HomeService, ServiceInput } from '~/types/service';
import { normalizeService, serviceSlugFromPath } from '~/types/service';

function toServiceInput(item: ServicesCollectionItem): ServiceInput {
  const row = item as ServicesCollectionItem & {
    icon?: ServiceInput['icon'];
    order?: number;
    title?: { en?: string; pt?: string };
    description?: { en?: string; pt?: string };
  };

  return {
    slug: serviceSlugFromPath(item.stem ?? item.id ?? ''),
    published: item.published ?? true,
    order: row.order ?? 99,
    icon: row.icon ?? 'fantasyMaps',
    title: {
      en: row.title?.en ?? '',
      pt: row.title?.pt ?? '',
    },
    description: {
      en: row.description?.en ?? '',
      pt: row.description?.pt ?? '',
    },
  };
}

function sortServices(a: ServiceInput, b: ServiceInput) {
  const byOrder = (a.order ?? 99) - (b.order ?? 99);
  if (byOrder !== 0) return byOrder;
  return a.slug.localeCompare(b.slug);
}

async function loadFromContent(locale: string): Promise<HomeService[]> {
  const items = await queryCollection('services').all();
  if (!items.length) return [];

  return items
    .map((item) => toServiceInput(item))
    .filter((service) => service.published !== false)
    .sort(sortServices)
    .map((input) => normalizeService(input, locale));
}

function loadFromLegacy(locale: 'en' | 'pt'): HomeService[] {
  return servicesFallback
    .filter((service) => service.published !== false)
    .sort(sortServices)
    .map((input) => normalizeService(input, locale));
}

export function useServiceCollection() {
  const { locale } = useI18n();

  const { data, pending, refresh, error } = useAsyncData(
    'content-services',
    async () => {
      const code = locale.value.startsWith('pt') ? 'pt' : 'en';
      try {
        const fromContent = await loadFromContent(code);
        if (fromContent.length) return fromContent;
      } catch (e) {
        if (import.meta.dev) {
          console.warn('[services] Nuxt Content falhou, a usar data/services.ts', e);
        }
      }
      return loadFromLegacy(code);
    },
    {
      default: () => loadFromLegacy('en'),
      watch: [locale],
    },
  );

  const services = computed(() => data.value ?? loadFromLegacy('en'));

  return {
    services,
    pending,
    refresh,
    error,
  };
}
