let _getTemplate = (name: string) => require(`../class/component-base/${name}/template.html`),
    _getStyles = (name: string) => require(`../class/component-base/${name}/styles.css`);

export const GDEIC_COMPONENT_TEMPLATE_CACHE = {
    'HOLD_ON': _getTemplate('gdeic-hold-on')
}

export const GDEIC_COMPONENT_STYLES_CACHE = {
    'HOLD_ON': _getStyles('gdeic-hold-on')
}