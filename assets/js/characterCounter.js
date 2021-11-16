
const parentElem = document.querySelector(
    '[data-module="govuk-character-count"]'
);

if (parentElem) {
    const inputElem = parentElem.querySelector('.govuk-js-character-count');
    const { maxlength } = parentElem.dataset;
    const inputHint = parentElem.querySelector(
        '.govuk-character-count__message'
    );

    inputHint.textContent = `You have ${maxlength} characters remaining`;

    inputElem.addEventListener('input', (inputEvent) =>
        updateRemainingCharacters(maxlength, inputEvent, inputHint)
    );
}

function updateRemainingCharacters(maxlength, inputEvent, inputHint) {
    const charactersRemaining = maxlength - inputEvent.target.value.length;

    if (charactersRemaining < 0) {
        inputHint.classList.replace('govuk-hint', 'govuk-error-message');
        inputHint.textContent = `You have ${Math.abs(charactersRemaining)} characters too many`;
    } else {
        inputHint.classList.contains('govuk-error-message') &&
            inputHint.classList.replace('govuk-error-message', 'govuk-hint');
        inputHint.textContent = `You have ${charactersRemaining} characters remaining`;
    }
}