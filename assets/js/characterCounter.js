// This file uses the following polyfills for older browsers:
// require('govuk-frontend/govuk/vendor/polyfills/Function/prototype/bind');
// require('govuk-frontend/govuk/vendor/polyfills/Event');
// require('govuk-frontend/govuk/vendor/polyfills/Element/prototype/classList');

function CharacterCount($module) {
    this.$module = $module;
    this.$textarea = $module.querySelector('.govuk-js-character-count');
    if (this.$textarea) {
        this.$countMessage = document.getElementById(
            this.$textarea.id + '-info'
        );
    }
}

CharacterCount.prototype.defaults = {
    characterCountAttribute: 'data-maxlength',
    wordCountAttribute: 'data-maxwords',
};

CharacterCount.prototype.init = function () {
    var $module = this.$module;
    var $textarea = this.$textarea;
    var $countMessage = this.$countMessage;

    if (!$textarea || !$countMessage) {
        return;
    }

    $textarea.insertAdjacentElement('afterend', $countMessage);

    this.options = this.getDataset($module);

    var countAttribute = this.defaults.characterCountAttribute;
    if (this.options.maxwords) {
        countAttribute = this.defaults.wordCountAttribute;
    }

    this.maxLength = $module.getAttribute(countAttribute);

    if (!this.maxLength) {
        return;
    }

    $module.removeAttribute('maxlength');

    if ('onpageshow' in window) {
        window.addEventListener('pageshow', this.sync.bind(this));
    } else {
        window.addEventListener('DOMContentLoaded', this.sync.bind(this));
    }

    this.sync();
};

CharacterCount.prototype.sync = function () {
    this.bindChangeEvents();
    this.updateCountMessage();
};

CharacterCount.prototype.getDataset = function (element) {
    var dataset = {};
    var attributes = element.attributes;
    if (attributes) {
        for (var i = 0; i < attributes.length; i++) {
            var attribute = attributes[i];
            var match = attribute.name.match(/^data-(.+)/);
            if (match) {
                dataset[match[1]] = attribute.value;
            }
        }
    }
    return dataset;
};

CharacterCount.prototype.count = function (text) {
    var length;
    if (this.options.maxwords) {
        var tokens = text.match(/\S+/g) || [];
        length = tokens.length;
    } else {
        length = text.length;
    }
    return length;
};

CharacterCount.prototype.bindChangeEvents = function () {
    var $textarea = this.$textarea;
    $textarea.addEventListener('keyup', this.checkIfValueChanged.bind(this));
    $textarea.addEventListener('focus', this.handleFocus.bind(this));
    $textarea.addEventListener('blur', this.handleBlur.bind(this));
};

CharacterCount.prototype.checkIfValueChanged = function () {
    if (!this.$textarea.oldValue) this.$textarea.oldValue = '';
    if (this.$textarea.value !== this.$textarea.oldValue) {
        this.$textarea.oldValue = this.$textarea.value;
        this.updateCountMessage();
    }
};

CharacterCount.prototype.updateCountMessage = function () {
    var countElement = this.$textarea;
    var options = this.options;
    var countMessage = this.$countMessage;
    var currentLength = this.count(countElement.value);
    var maxLength = this.maxLength;
    var remainingNumber = maxLength - currentLength;

    var thresholdPercent = options.threshold ? options.threshold : 0;
    var thresholdValue = (maxLength * thresholdPercent) / 100;
    if (thresholdValue > currentLength) {
        countMessage.classList.add('govuk-character-count__message--disabled');
        countMessage.setAttribute('aria-hidden', true);
    } else {
        countMessage.classList.remove(
            'govuk-character-count__message--disabled'
        );
        countMessage.removeAttribute('aria-hidden');
    }

    if (remainingNumber < 0) {
        countElement.classList.add('govuk-textarea--error');
        countMessage.classList.remove('govuk-hint');
        countMessage.classList.add('govuk-error-message');
    } else {
        countElement.classList.remove('govuk-textarea--error');
        countMessage.classList.remove('govuk-error-message');
        countMessage.classList.add('govuk-hint');
    }

    var charVerb = 'remaining';
    var charNoun = 'character';
    var displayNumber = remainingNumber;
    if (options.maxwords) {
        charNoun = 'word';
    }
    charNoun =
        charNoun + (remainingNumber === -1 || remainingNumber === 1 ? '' : 's');

    charVerb = remainingNumber < 0 ? 'too many' : 'remaining';
    displayNumber = Math.abs(remainingNumber);

    countMessage.innerHTML =
        'You have ' + displayNumber + ' ' + charNoun + ' ' + charVerb;
};

CharacterCount.prototype.handleFocus = function () {
    this.valueChecker = setInterval(this.checkIfValueChanged.bind(this), 1000);
};

CharacterCount.prototype.handleBlur = function () {
    clearInterval(this.valueChecker);
};

const $characterCount = document.querySelector(
    '[data-module="govuk-character-count"]'
);
new CharacterCount($characterCount).init();
