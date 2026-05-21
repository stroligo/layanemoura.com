<template>
  <div class="uikit-page pb-20">
    <!-- Hero do UI Kit -->
    <section class="!pt-6 !pb-10 border-b border-border bg-surface/40">
      <div class="container-fluid wrap">
        <p class="uikit-title">Design system</p>
        <h1 class="uikit-heading">UI Kit — Layane Moura</h1>
        <p class="prose-site mt-4 max-w-3xl">
          Referência visual baseada em
          <code class="rounded bg-paper px-1.5 py-0.5 text-sm text-terracotta"
            >Projeto/uikit.png</code
          >. Tokens, tipografia e componentes usados no site Nuxt + Tailwind.
        </p>
        <div class="mt-8 overflow-hidden rounded-[var(--radius-ui)] border border-border shadow-elevation-2">
          <img
            src="/uikit-reference.png"
            alt="UI Kit de referência — Layane Moura"
            class="w-full"
            width="2400"
            height="auto"
            loading="eager"
          />
        </div>
      </div>
    </section>

    <div class="container-fluid wrap">
      <!-- Paleta -->
      <section class="uikit-section" id="colors">
        <p class="uikit-title">01</p>
        <h2 class="uikit-heading">Paleta de cores</h2>
        <div class="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
          <div v-for="color in colors" :key="color.token" class="swatch">
            <div
              class="swatch-color"
              :style="{ backgroundColor: color.hex }"
            />
            <div class="swatch-meta">
              <p class="font-medium text-cocoa">{{ color.name }}</p>
              <p>{{ color.hex }}</p>
              <p class="text-ink-muted/80">{{ color.token }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Tipografia -->
      <section class="uikit-section" id="typography">
        <p class="uikit-title">02</p>
        <h2 class="uikit-heading">Tipografia</h2>
        <ul class="mt-6 flex flex-wrap gap-4 font-sans text-sm text-ink-muted">
          <li v-for="font in fonts" :key="font.token">
            <strong class="text-cocoa">{{ font.name }}</strong> — {{ font.role }}
            <span v-if="font.source"> ({{ font.source }})</span>
            <span v-if="font.file"> → <code class="text-terracotta">{{ font.file }}</code></span>
          </li>
        </ul>
        <ul class="mt-8 space-y-10">
          <li
            v-for="item in typography"
            :key="item.name"
            class="border-b border-border pb-8 last:border-0"
          >
            <p class="font-sans text-xs uppercase tracking-[0.2em] text-ink-muted">
              {{ item.name }} — {{ item.spec }}
            </p>
            <p :class="[item.class, 'mt-3']">{{ item.sample }}</p>
          </li>
        </ul>
      </section>

      <!-- Botões -->
      <section class="uikit-section" id="buttons">
        <p class="uikit-title">03</p>
        <h2 class="uikit-heading">Botões</h2>
        <div class="mt-8 flex flex-wrap items-center gap-4">
          <button type="button" class="btn-primary">Primary</button>
          <button type="button" class="btn-secondary">Secondary</button>
          <button type="button" class="btn-tertiary">
            Tertiary <span class="btn-tertiary-arrow" aria-hidden="true">→</span>
          </button>
          <button type="button" class="btn-icon" aria-label="Favorite">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="h-5 w-5"
            >
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              />
            </svg>
          </button>
          <button type="button" class="btn-primary" disabled>Disabled</button>
        </div>
      </section>

      <!-- Formulários -->
      <section class="uikit-section" id="forms">
        <p class="uikit-title">04</p>
        <h2 class="uikit-heading">Campos de formulário</h2>
        <div class="mt-8 grid gap-10 lg:grid-cols-2">
          <div class="space-y-5">
            <div>
              <label for="uikit-name" class="label-ui mb-1.5 block">Nome</label>
              <input
                id="uikit-name"
                type="text"
                class="input-field"
                placeholder="Seu nome"
              />
            </div>
            <div>
              <label for="uikit-email" class="label-ui mb-1.5 block">Email</label>
              <input
                id="uikit-email"
                type="email"
                class="input-field"
                placeholder="email@exemplo.com"
              />
            </div>
            <div>
              <label for="uikit-select" class="label-ui mb-1.5 block"
                >Tipo de projeto</label
              >
              <select id="uikit-select" class="select-field">
                <option>Mapa de fantasia</option>
                <option>Capa de livro</option>
                <option>Ilustração editorial</option>
              </select>
            </div>
            <div class="flex items-center gap-2">
              <input id="uikit-check" type="checkbox" class="checkbox-ui" checked />
              <label for="uikit-check" class="label-ui !font-normal"
                >Aceito ser contactada</label
              >
            </div>
          </div>
          <div class="space-y-5">
            <div>
              <label for="uikit-error" class="label-ui mb-1.5 block">Estado erro</label>
              <input
                id="uikit-error"
                type="text"
                class="input-field input-field--error"
                value="Campo inválido"
                aria-invalid="true"
              />
              <p class="field-error">Este campo é obrigatório.</p>
            </div>
            <div>
              <label for="uikit-message" class="label-ui mb-1.5 block"
                >Mensagem</label
              >
              <textarea
                id="uikit-message"
                class="input-field min-h-[120px] resize-y"
                placeholder="Conte sobre o seu projeto..."
              />
            </div>
            <fieldset class="space-y-2">
              <legend class="label-ui mb-2">Opções</legend>
              <label class="flex items-center gap-2">
                <input type="radio" name="uikit-radio" class="radio-ui" checked />
                <span class="font-body text-sm">Freelance</span>
              </label>
              <label class="flex items-center gap-2">
                <input type="radio" name="uikit-radio" class="radio-ui" />
                <span class="font-body text-sm">Full-time remoto</span>
              </label>
            </fieldset>
          </div>
        </div>
      </section>

      <!-- Alertas -->
      <section class="uikit-section" id="alerts">
        <p class="uikit-title">05</p>
        <h2 class="uikit-heading">Alertas</h2>
        <div class="mt-8 space-y-3 max-w-xl">
          <div class="alert alert-success" role="status">
            <span aria-hidden="true">✓</span>
            Mensagem enviada com sucesso.
          </div>
          <div class="alert alert-info" role="status">
            <span aria-hidden="true">i</span>
            Disponível para projetos nas próximas semanas.
          </div>
          <div class="alert alert-warning" role="status">
            <span aria-hidden="true">!</span>
            Prazo apertado — contacte com antecedência.
          </div>
          <div class="alert alert-error" role="alert">
            <span aria-hidden="true">×</span>
            Não foi possível enviar. Tente novamente.
          </div>
        </div>
      </section>

      <!-- Tabs -->
      <section class="uikit-section" id="tabs">
        <p class="uikit-title">06</p>
        <h2 class="uikit-heading">Tabs</h2>
        <div class="tabs mt-8">
          <button
            v-for="tab in demoTabs"
            :key="tab"
            type="button"
            class="tab"
            :class="{ active: activeTab === tab }"
            @click="activeTab = tab"
          >
            {{ tab }}
          </button>
        </div>
        <p class="mt-6 font-body text-ink-muted">
          Conteúdo da tab <strong class="text-cocoa">{{ activeTab }}</strong>.
        </p>
      </section>

      <!-- Stepper -->
      <section class="uikit-section" id="stepper">
        <p class="uikit-title">07</p>
        <h2 class="uikit-heading">Stepper</h2>
        <div class="stepper mt-10 max-w-2xl">
          <div class="stepper-step active">
            <div class="stepper-dot">1</div>
            <span class="stepper-label">Briefing</span>
          </div>
          <div class="stepper-line" />
          <div class="stepper-step">
            <div class="stepper-dot">2</div>
            <span class="stepper-label">Sketch</span>
          </div>
          <div class="stepper-line" />
          <div class="stepper-step">
            <div class="stepper-dot">3</div>
            <span class="stepper-label">Entrega</span>
          </div>
        </div>
      </section>

      <!-- Elevações -->
      <section class="uikit-section" id="shadows">
        <p class="uikit-title">08</p>
        <h2 class="uikit-heading">Elevações</h2>
        <div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div
            v-for="shadow in shadows"
            :key="shadow.level"
            :class="[
              shadow.class,
              'flex h-28 items-center justify-center rounded-[var(--radius-ui)] border border-border bg-paper',
            ]"
          >
            <span class="font-sans text-xs text-ink-muted">{{ shadow.label }}</span>
          </div>
        </div>
      </section>

      <!-- Card de projeto -->
      <section class="uikit-section" id="cards">
        <p class="uikit-title">09</p>
        <h2 class="uikit-heading">Card de projeto</h2>
        <p class="prose-site mt-4">
          A galeria da Home usa <code class="text-terracotta">GalleryItem</code> —
          apenas imagem, grid orgânica e modal ao clicar.
        </p>
        <div class="gallery-organic mt-8 max-w-3xl">
          <GalleryItem
            v-for="project in featured"
            :key="project.slug"
            :project="project"
            @select="() => {}"
          />
        </div>
      </section>

      <!-- Navegação (preview) -->
      <section class="uikit-section" id="navigation">
        <p class="uikit-title">10</p>
        <h2 class="uikit-heading">Navegação</h2>
        <p class="prose-site mt-2">
          Header com logo centralizada; barra de filtros (Home) com pills à
          esquerda e botão Get in touch à direita.
        </p>
        <div
          class="mt-8 overflow-hidden rounded-[var(--radius-ui)] border border-border bg-paper shadow-elevation-1"
        >
          <div
            class="flex items-center justify-center border-b border-border px-6"
            style="height: var(--height-nav)"
          >
            <SiteLogo class="pointer-events-none" />
          </div>
          <div class="gallery-filter-bar px-6">
            <ul class="gallery-filter-pills">
              <li><span class="filter-pill active">All</span></li>
              <li><span class="filter-pill">Travel</span></li>
              <li><span class="filter-pill">Fantasy Maps</span></li>
            </ul>
            <span class="btn-primary gallery-filter-cta text-sm">Get in touch</span>
          </div>
        </div>
      </section>

      <!-- Footer (preview) -->
      <section class="uikit-section" id="footer">
        <p class="uikit-title">11</p>
        <h2 class="uikit-heading">Footer</h2>
        <div class="mt-8 overflow-hidden rounded-[var(--radius-ui)]">
          <Footer />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { colors, fonts, shadows, typography } from '~/data/tokens';
import { getFeaturedProjects } from '~/data/projects';

const featured = getFeaturedProjects().slice(0, 3);
const demoTabs = ['Mapas', 'Capas', 'Viagem', 'Editorial'];
const activeTab = ref(demoTabs[0]);

definePageMeta({
  layout: 'uikit',
});

useSeoMeta({
  title: 'UI Kit — Layane Moura',
  robots: 'noindex, nofollow',
});
</script>
