import {
  defineCollection,
  defineContentConfig,
  property,
} from '@nuxt/content';
import { z } from 'zod';
import { isSafeEmailAddress, isSafeHttpUrl, isSafeMailtoHref } from './utils/security';

const galleryGroup = z.enum(['maps', 'more']);

const safeHrefSchema = z
  .string()
  .min(1)
  .refine(
    (v) =>
      (v.startsWith('mailto:') && isSafeMailtoHref(v)) || isSafeHttpUrl(v),
    'Use https://…, a site path (/images/…), or mailto:user@domain',
  );

const markdownHint =
  'Markdown: **negrito**, *itálico*. Novo parágrafo = linha em branco.';

const descriptionText = (label: string, hint: string) =>
  property(z.string().default('')).editor({
    input: 'textarea',
    label,
    description: hint,
  });

const localeLine = (labelEn: string, labelPt: string) =>
  z.object({
    en: descriptionText(labelEn, 'Texto em inglês.'),
    pt: descriptionText(labelPt, 'Texto em português.'),
  });

const projectImageItem = z.object({
  src: property(z.string().min(1)).editor({
    input: 'media',
    label: 'Image',
    description: 'From public/ (e.g. /images/projects/…).',
  }),
});

const projectSchema = z.object({
  published: property(z.boolean().default(true)).editor({
    label: 'Published',
    description: 'When off, the project is hidden from the public gallery.',
  }),
  highlight: property(z.boolean().default(false)).editor({
    label: 'Highlight',
    description: 'Pins this project to the top of its section (Maps or More).',
  }),
  title: z.string().min(1).describe('Project title'),
  subtitle: z.string().min(1).describe('Short subtitle / type of work'),
  category: galleryGroup.describe('Gallery section: maps or more'),
  tags: z
    .array(z.string().min(1))
    .min(1)
    .describe(
      'Classification tags (free text; e.g. travel, desert, fantasy-maps). Chips appear when used in a project.',
    ),
  year: z.number().int().min(2000).max(2100).describe('Year completed'),
  links: z
    .array(
      z.object({
        label: localeLine('Button label (EN)', 'Rótulo do botão (PT)'),
        url: safeHrefSchema.describe('Button URL (https://…)'),
      }),
    )
    .optional()
    .describe(
      'Action buttons in the project modal (one or more). Set label (EN/PT) and URL for each.',
    ),
  description: z
    .object({
      en: descriptionText(
        'Description (English)',
        `Modal text in English. ${markdownHint}`,
      ),
      pt: descriptionText(
        'Descrição (português)',
        `Texto do modal em português. ${markdownHint}`,
      ),
    })
    .default({ en: '', pt: '' })
    .describe('Modal body copy (Markdown)'),
  images: z
    .array(projectImageItem)
    .min(1)
    .optional()
    .describe(
      'Images — modal gallery (order = slideshow). First = cover. Add rows and pick files with the media selector.',
    ),
  image: z
    .string()
    .optional()
    .describe('Legado: uma única imagem (use `images` para várias)'),
  layout: z
    .enum(['tall', 'wide', 'normal'])
    .default('normal')
    .describe('Gallery grid layout'),
});

const reviewSchema = z.object({
  published: property(z.boolean().default(true)).editor({
    label: 'Published',
    description: 'When off, the review is hidden from the carousel.',
  }),
  order: z
    .number()
    .int()
    .default(0)
    .describe('Sort order in the carousel (lower = first)'),
  quote: localeLine('Quote (English)', 'Depoimento (português)').describe(
    'Testimonial text shown in the carousel',
  ),
  clientName: property(z.string().min(1)).editor({
    label: 'Name',
    description:
      'Person who wrote the testimonial (e.g. Sarah Mitchell). Use this name for the file slug: sarah-mitchell.yml.',
  }),
  clientRole: localeLine('Role (English)', 'Cargo (português)'),
  clientCompany: z
    .string()
    .optional()
    .describe('Company or publication (optional)'),
  projectType: localeLine(
    'Project type (English)',
    'Tipo de projeto (português)',
  )
    .optional()
    .describe('Short label under the author (optional)'),
});

const detailBlock = (title: string) =>
  z.object({
    label: localeLine(`${title} — label (EN)`, `${title} — rótulo (PT)`),
    value: localeLine(`${title} — value (EN)`, `${title} — valor (PT)`),
  });

const socialIcon = z
  .enum([
    'behance',
    'instagram',
    'threads',
    'linkedin',
    'twitter',
    'facebook',
    'whatsapp',
    'email',
  ])
  .describe(
    'Icon slug — must match a file in assets/images/icons/ (e.g. behance.svg).',
  );

const socialSchema = z.object({
  published: property(z.boolean().default(true)).editor({
    label: 'Published',
    description: 'When off, the link is hidden.',
  }),
  order: z
    .number()
    .int()
    .default(0)
    .describe('Sort order (lower = first)'),
  href: safeHrefSchema.describe('Profile URL or mailto:email@example.com'),
  icon: socialIcon.describe(
    'Social network — label in the UI is set automatically (e.g. instagram → Instagram). File slug should match: instagram.yml.',
  ),
});

const getInTouchSchema = z.object({
  photo: z
    .object({
      src: property(z.string().min(1)).editor({
        input: 'media',
        label: 'Photo',
        description: 'Portrait on the contact page (e.g. /images/about.JPG).',
      }),
      alt: localeLine('Photo alt (EN)', 'Alt da foto (PT)').describe(
        'Use {name} for the site owner name.',
      ),
    })
    .describe('Photo column'),
  email: z
    .string()
    .email()
    .describe('Contact email shown on the page and used by the form'),
  eyebrow: localeLine('Eyebrow (EN)', 'Eyebrow (PT)'),
  title: localeLine('Page title (EN)', 'Título da página (PT)'),
  about: localeLine('About text (EN)', 'Texto sobre (PT)').describe(
    'Biography — separate paragraphs with a blank line.',
  ),
  aboutEmail: localeLine('Email line (EN)', 'Linha do e-mail (PT)').describe(
    'Use {email} where the address should appear.',
  ),
  heading: localeLine('Contact heading (EN)', 'Título da secção contacto (PT)'),
  basedIn: detailBlock('Based in'),
  languages: detailBlock('Languages'),
  availability: detailBlock('Availability'),
});

export default defineContentConfig({
  collections: {
    projects: defineCollection({
      type: 'data',
      source: 'projects/*.yml',
      schema: projectSchema,
    }),
    reviews: defineCollection({
      type: 'data',
      source: 'reviews/*.yml',
      schema: reviewSchema,
    }),
    pages: defineCollection({
      type: 'data',
      source: 'pages/*.yml',
      schema: getInTouchSchema,
    }),
    social: defineCollection({
      type: 'data',
      source: 'social/*.yml',
      schema: socialSchema,
    }),
  },
});
