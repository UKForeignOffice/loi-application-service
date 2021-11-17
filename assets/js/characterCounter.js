const inputParentElem = document.querySelector(
    '[data-module="govuk-character-count"]'
);

if (inputParentElem) {
    prepareCharCounter();
}

function prepareCharCounter() {
    const inputElem = inputParentElem.querySelector(
        '.govuk-js-character-count'
    );
    const commonParams = {
        charLimit: Number(inputParentElem.dataset.maxlength),
        inputElem,
        inputHint: inputParentElem.querySelector(
            '.govuk-character-count__message'
        ),
    };

    displayInitialHintText(commonParams);
    inputElem.addEventListener('input', (_event) =>
        updateHintText(commonParams)
    );
}

function displayInitialHintText(commonParams) {
    const { charLimit, inputElem, inputHint } = commonParams;
    const inputHasValue = inputElem.value.length > 0;

    inputHasValue
        ? updateHintText(commonParams)
        : (inputHint.textContent = `You have ${charLimit} characters remaining`);
}

function updateHintText({ charLimit, inputElem, inputHint }) {
    const charactersRemaining = charLimit - inputElem.value.length;
    const overCharLimit = charactersRemaining < 0;

    overCharLimit
        ? showHintError(inputHint, charactersRemaining)
        : showRemainingCharacters(inputHint, charactersRemaining);
}

function showHintError(inputHint, charactersRemaining) {
    inputHint.classList.replace('govuk-hint', 'govuk-error-message');
    inputHint.textContent = `You have ${Math.abs(
        charactersRemaining
    )} characters too many`;
}

function showRemainingCharacters(inputHint, charactersRemaining) {
    inputHint.classList.replace('govuk-error-message', 'govuk-hint');
    inputHint.textContent = `You have ${charactersRemaining} characters remaining`;
}
