const defaultTimeAttributes = {
    label: 'Título do Campo',
    labelClass: 'form-label',
    wrapperClass: 'mb-1',
    class: 'form-control',
    id: 'ftime',
    name: 'ftime',
    value: '',
    step: '60',
    ReadOnly: false,
    Disabled: false,
    Required: false
};

function normalizeTimeBool(value, fallback) {
    if (value === undefined || value === null || value === '') {
        return fallback;
    }
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
        const p = value.trim().toLowerCase();
        if (p === 'true' || p === '1') return true;
        if (p === 'false' || p === '0') return false;
    }
    return Boolean(value);
}

function normalizeTimeDataset(dataset) {
    const out = {};
    for (let key in dataset) {
        let k = key;
        if (key === 'readonly')  k = 'ReadOnly';
        else if (key === 'disabled') k = 'Disabled';
        else if (key === 'required') k = 'Required';
        out[k] = dataset[key];
    }
    return out;
}

class TimeField {
    constructor(attributes) {
        this.attributes = Object.assign({}, defaultTimeAttributes, attributes);
    }

    render() {
        const {
            label,
            labelClass,
            wrapperClass,
            ReadOnly,
            Disabled,
            Required,
            step,
            value,
            id,
            name,
            class: cssClass
        } = this.attributes;

        const isReadOnly = normalizeTimeBool(ReadOnly, false);
        const isDisabled = normalizeTimeBool(Disabled, false);
        const isRequired = normalizeTimeBool(Required, false);

        const requiredMark = isRequired ? ' <span class="text-danger">*</span>' : '';

        let html = '<div class="' + wrapperClass + '">';

        if (label) {
            html += '<label for="' + id + '" class="' + labelClass + '">' + label + requiredMark + '</label>';
        }

        html += '<input type="time" id="' + id + '" name="' + name + '" class="' + cssClass + '" step="' + step + '" value="' + value + '"';
        if (isReadOnly) html += ' readonly="readonly"';
        if (isDisabled) html += ' disabled="disabled"';
        if (isRequired) html += ' required="required"';
        html += '>';

        html += '</div>';

        return html;
    }
}

(function () {
    var containers = document.querySelectorAll('form .field_time');

    containers.forEach(function (container) {
        var attrs = normalizeTimeDataset(container.dataset);
        var field = new TimeField(attrs);
        container.innerHTML = field.render();
    });
}());
