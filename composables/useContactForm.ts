import { isSafeEmailAddress, stripControlChars } from '~/utils/security';

export type ContactFormStatus = 'success' | 'error';
export type ContactFormErrorReason = 'invalid' | 'server' | 'rateLimit' | 'notConfigured';

export function useContactForm(options: {
  contactEmail: MaybeRefOrGetter<string>;
  formId?: string;
}) {
  const { t, locale } = useI18n();
  const formId = options.formId ?? 'contact';

  const form = reactive({
    name: '',
    email: '',
    message: '',
    website: '',
  });

  const formStatus = ref<ContactFormStatus | null>(null);
  const formErrorReason = ref<ContactFormErrorReason>('invalid');
  const formSubmitting = ref(false);
  const fieldErrors = reactive({
    email: '',
  });

  const contactEmail = computed(() => toValue(options.contactEmail));

  function validateEmailField(): boolean {
    const email = stripControlChars(form.email);

    if (!email) {
      fieldErrors.email = t('contact.form.emailRequired');
      return false;
    }

    if (!isSafeEmailAddress(email)) {
      fieldErrors.email = t('contact.form.emailInvalid');
      return false;
    }

    fieldErrors.email = '';
    return true;
  }

  function onEmailInput() {
    if (fieldErrors.email) {
      validateEmailField();
    }
  }

  const feedbackMessage = computed(() => {
    const email = contactEmail.value;
    if (formStatus.value === 'success') {
      return t('contact.form.successMessage');
    }
    if (formErrorReason.value === 'notConfigured') {
      return t('contact.form.errorNotConfigured', { email });
    }
    if (formErrorReason.value === 'rateLimit') {
      return t('contact.form.errorRateLimit');
    }
    if (formErrorReason.value === 'server') {
      return t('contact.form.errorServer', { email });
    }
    return t('contact.form.errorInvalid', { email });
  });

  function resetFormFeedback() {
    formStatus.value = null;
  }

  function resetFormFields() {
    form.name = '';
    form.email = '';
    form.message = '';
    form.website = '';
    fieldErrors.email = '';
  }

  function mapSubmitError(statusCode?: number): ContactFormErrorReason {
    if (statusCode === 503) return 'notConfigured';
    if (statusCode === 429) return 'rateLimit';
    if (statusCode === 400) return 'invalid';
    return 'server';
  }

  async function onSubmit() {
    if (!import.meta.client) return;

    formSubmitting.value = true;
    resetFormFeedback();

    const name = stripControlChars(form.name);
    const emailValid = validateEmailField();
    const message = stripControlChars(form.message);

    if (!name || !message || !emailValid) {
      formErrorReason.value = 'invalid';
      formStatus.value = 'error';
      formSubmitting.value = false;
      if (!emailValid) {
        document.getElementById(`${formId}-email`)?.focus();
      }
      return;
    }

    const email = stripControlChars(form.email);
    const localeCode = locale.value.startsWith('pt') ? 'pt' : 'en';

    try {
      await $fetch('/api/contact', {
        method: 'POST',
        body: {
          name,
          email,
          message,
          website: form.website,
          locale: localeCode,
        },
      });
      resetFormFields();
      formStatus.value = 'success';
      await nextTick();
      document.getElementById(`${formId}-feedback`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    } catch (error) {
      const statusCode =
        error && typeof error === 'object' && 'statusCode' in error
          ? Number((error as { statusCode?: number }).statusCode)
          : undefined;
      formErrorReason.value = mapSubmitError(statusCode);
      formStatus.value = 'error';
    } finally {
      formSubmitting.value = false;
    }
  }

  return {
    formId,
    form,
    formStatus,
    formSubmitting,
    fieldErrors,
    validateEmailField,
    onEmailInput,
    feedbackMessage,
    onSubmit,
  };
}
