import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';

// Enforce English HTML5 Form Validation Tooltips across all browsers & inputs
if (typeof window !== 'undefined') {
  document.addEventListener(
    'invalid',
    (e) => {
      const target = e.target;
      if (!target || !target.validity) return;

      if (target.validity.valueMissing) {
        if (target.tagName === 'SELECT') {
          target.setCustomValidity('Please select an item in the list.');
        } else if (target.type === 'checkbox') {
          target.setCustomValidity('Please check this box if you want to proceed.');
        } else if (target.type === 'radio') {
          target.setCustomValidity('Please select one of these options.');
        } else {
          target.setCustomValidity('Please fill in this field.');
        }
      } else if (target.validity.typeMismatch) {
        if (target.type === 'email') {
          target.setCustomValidity('Please enter a valid email address.');
        } else if (target.type === 'url') {
          target.setCustomValidity('Please enter a valid URL.');
        } else if (target.type === 'number') {
          target.setCustomValidity('Please enter a valid number.');
        } else {
          target.setCustomValidity('Please enter a valid value.');
        }
      } else if (target.validity.patternMismatch) {
        target.setCustomValidity(target.title || 'Please match the requested format.');
      } else if (target.validity.tooShort) {
        target.setCustomValidity(`Please lengthen this text to at least ${target.minLength} characters.`);
      } else if (target.validity.tooLong) {
        target.setCustomValidity(`Please shorten this text to at most ${target.maxLength} characters.`);
      } else if (target.validity.rangeUnderflow) {
        target.setCustomValidity(`Value must be greater than or equal to ${target.min}.`);
      } else if (target.validity.rangeOverflow) {
        target.setCustomValidity(`Value must be less than or equal to ${target.max}.`);
      } else if (target.validity.stepMismatch) {
        target.setCustomValidity('Please enter a valid value.');
      } else if (target.validity.badInput) {
        target.setCustomValidity('Please enter a valid value.');
      } else {
        target.setCustomValidity('Please fill in this field.');
      }
    },
    true
  );

  document.addEventListener(
    'input',
    (e) => {
      if (e.target && typeof e.target.setCustomValidity === 'function') {
        e.target.setCustomValidity('');
      }
    },
    true
  );

  document.addEventListener(
    'change',
    (e) => {
      if (e.target && typeof e.target.setCustomValidity === 'function') {
        e.target.setCustomValidity('');
      }
    },
    true
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
