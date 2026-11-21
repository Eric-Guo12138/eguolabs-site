'use strict';
// Formspree's public form endpoint is configured in HTML; no private keys are used.
(() => {
  const form = document.querySelector('#enquiry-form');
  if (!form) return;
  const fields = [...form.querySelectorAll('input:not([type="hidden"]):not([name="_gotcha"]), select, textarea')];
  const fieldset = document.querySelector('#enquiry-fields');
  const button = document.querySelector('#enquiry-submit');
  const status = document.querySelector('#enquiry-status');
  const summary = document.querySelector('#enquiry-errors');
  const failure = "Your enquiry couldn't be sent. Please try again or contact us directly at eric@eguolabs.com.";
  let sending = false;
  form.noValidate = true; // Native required/email validation remains available without JS.

  function fieldError(field) {
    const value = field.value.trim();
    if (field.required && !value) return {
      name: 'Enter your name.', email: 'Enter your work email.', category: 'Choose an enquiry category.',
      message: 'Tell us about your workflow.'
    }[field.name];
    if (field.type === 'email' && field.validity.typeMismatch) return 'Enter a valid email address.';
    if (field.maxLength > 0 && value.length > field.maxLength) return `Use no more than ${field.maxLength.toLocaleString('en-GB')} characters.`;
    if (field.minLength > 0 && value.length < field.minLength) return `Use at least ${field.minLength} characters to describe your workflow.`;
    if (field.tagName === 'SELECT' && ![...field.options].some(option => option.value === value && value)) return 'Choose an enquiry category.';
    return '';
  }
  function showFieldError(field, message) {
    const note = document.getElementById(field.name + '-error');
    field.setAttribute('aria-invalid', String(Boolean(message)));
    note.textContent = message;
    note.hidden = !message;
  }
  function showSummary(message, invalid = []) {
    summary.replaceChildren();
    const text = document.createElement('p');
    text.textContent = message;
    summary.append(text);
    if (invalid.length) {
      const list = document.createElement('ul');
      invalid.forEach(field => {
        const item = document.createElement('li');
        const link = document.createElement('a');
        link.href = '#' + field.id;
        link.textContent = document.getElementById(field.name + '-error').textContent;
        link.addEventListener('click', event => { event.preventDefault(); field.focus(); });
        item.append(link); list.append(item);
      });
      summary.append(list);
    }
    summary.hidden = false;
    summary.focus();
  }
  fields.forEach(field => field.addEventListener('input', () => {
    if (field.getAttribute('aria-invalid') === 'true') showFieldError(field, fieldError(field));
  }));
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (sending) return;
    status.textContent = '';
    status.classList.remove('is-success');
    summary.hidden = true;
    const invalid = fields.filter(field => {
      const error = fieldError(field);
      showFieldError(field, error);
      return Boolean(error);
    });
    if (invalid.length) { showSummary('Please check the highlighted fields.', invalid); return; }
    if (form.elements._gotcha.value) { showSummary(failure); return; }

    const data = new FormData(form);
    fields.forEach(field => data.set(field.name, field.value.trim()));
    data.set('subject', 'New EGuo Labs Website Enquiry — ' + data.get('category'));
    data.set('submitted_at', new Date().toISOString());
    sending = true;
    fieldset.disabled = true;
    form.setAttribute('aria-busy', 'true');
    button.textContent = 'Sending...';
    status.textContent = 'Sending your enquiry…';
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 20000);
    let accepted = false;
    try {
      const response = await fetch(form.action, {
        method: 'POST', body: data, headers: { Accept: 'application/json' }, signal: controller.signal
      });
      const result = await response.json();
      if (response.ok && result.ok === true) {
        accepted = true;
        form.reset();
        fields.forEach(field => showFieldError(field, ''));
        status.classList.add('is-success');
        status.textContent = "Enquiry received. Thank you — we'll review your message and get back to you by email.";
      } else {
        const rejected = [];
        for (const error of Array.isArray(result.errors) ? result.errors : []) {
          const field = fields.find(item => item.name === error.field);
          if (field && !rejected.includes(field)) {
            showFieldError(field, field.name === 'email' ? 'Please check your email address.' : 'Please check this field and try again.');
            rejected.push(field);
          }
        }
        status.textContent = '';
        showSummary(failure, rejected);
      }
    } catch (error) {
      status.textContent = '';
      showSummary(error.name === 'AbortError'
        ? "We couldn't confirm receipt. Your message is still here. Please contact eric@eguolabs.com before trying again."
        : failure);
    } finally {
      clearTimeout(timer);
      sending = false;
      fieldset.disabled = false;
      form.setAttribute('aria-busy', 'false');
      button.textContent = 'Send Enquiry';
      if (accepted) status.focus();
    }
  });
})();
