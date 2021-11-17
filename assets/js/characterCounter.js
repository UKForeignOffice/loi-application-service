
const parentElem = document.querySelector(
    '[data-module="govuk-character-count"]'
);

if (parentElem) {
    const inputElem = parentElem.querySelector('.govuk-js-character-count');
    const { maxlength } = parentElem.dataset;
    const inputHint = parentElem.querySelector(
        '.govuk-character-count__message'
    );

    if (inputElem.value.length > 0) {
        updateRemainingCharacters(maxlength, inputElem, inputHint);
    } else {
        inputHint.textContent = `You have ${maxlength} characters remaining`;
    }

    inputElem.addEventListener('input', (_e) =>
        updateRemainingCharacters(maxlength, inputElem, inputHint)
    );
}

function updateRemainingCharacters(maxlength, inputElem, inputHint) {
    const charactersRemaining = maxlength - inputElem.value.length;

    if (charactersRemaining < 0) {
        inputHint.classList.replace('govuk-hint', 'govuk-error-message');
        inputHint.textContent = `You have ${Math.abs(
            charactersRemaining
        )} characters too many`;
    } else {
        inputHint.classList.contains('govuk-error-message') &&
            inputHint.classList.replace('govuk-error-message', 'govuk-hint');
        inputHint.textContent = `You have ${charactersRemaining} characters remaining`;
    }
}