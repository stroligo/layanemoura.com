<template>
  <form :id="formId" class="contact-form" @submit.prevent="onSubmit">
    <h2 class="contact-form__title">{{ t('contact.form.title') }}</h2>
    <div class="contact-form__fields">
      <div class="contact-form__row">
        <div class="contact-form__field">
          <label :for="`${formId}-name`" class="contact-form__label">
            {{ t('contact.form.name') }}
          </label>
          <input
            :id="`${formId}-name`"
            v-model="form.name"
            type="text"
            required
            autocomplete="name"
            class="input-field"
          />
        </div>
        <div class="contact-form__field">
          <label :for="`${formId}-email`" class="contact-form__label">
            {{ t('contact.form.email') }}
          </label>
          <input
            :id="`${formId}-email`"
            v-model="form.email"
            type="email"
            inputmode="email"
            required
            autocomplete="email"
            spellcheck="false"
            class="input-field"
            :class="{ 'input-field--error': fieldErrors.email }"
            :aria-invalid="fieldErrors.email ? 'true' : undefined"
            :aria-describedby="fieldErrors.email ? `${formId}-email-error` : undefined"
            @blur="validateEmailField"
            @input="onEmailInput"
          />
          <p
            v-if="fieldErrors.email"
            :id="`${formId}-email-error`"
            class="field-error"
            role="alert"
          >
            {{ fieldErrors.email }}
          </p>
        </div>
      </div>
      <div class="contact-form__field">
        <label :for="`${formId}-message`" class="contact-form__label">
          {{ t('contact.form.message') }}
        </label>
        <textarea
          :id="`${formId}-message`"
          v-model="form.message"
          required
          rows="4"
          class="input-field contact-form__textarea"
        />
      </div>
      <div class="contact-form__honeypot" aria-hidden="true">
        <label :for="`${formId}-website`">Website</label>
        <input
          :id="`${formId}-website`"
          v-model="form.website"
          type="text"
          tabindex="-1"
          autocomplete="off"
        />
      </div>
    </div>
    <button type="submit" class="btn-primary contact-form__submit" :disabled="formSubmitting">
      {{ t('contact.form.submit') }}
    </button>

    <div
      v-if="formStatus"
      :id="`${formId}-feedback`"
      class="contact-form__feedback"
      :class="
        formStatus === 'success' ? 'contact-form__feedback--success' : 'contact-form__feedback--error'
      "
      role="status"
      aria-live="polite"
    >
      <p class="contact-form__feedback-title">
        {{ formStatus === 'success' ? t('contact.form.successTitle') : t('contact.form.errorTitle') }}
      </p>
      <p class="contact-form__feedback-text">
        {{ feedbackMessage }}
      </p>
    </div>
  </form>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    contactEmail: string;
    formId?: string;
  }>(),
  {
    formId: 'contact',
  },
);

const { t } = useI18n();

const {
  formId,
  form,
  formStatus,
  formSubmitting,
  fieldErrors,
  validateEmailField,
  onEmailInput,
  feedbackMessage,
  onSubmit,
} = useContactForm({
  contactEmail: () => props.contactEmail,
  formId: props.formId,
});
</script>
