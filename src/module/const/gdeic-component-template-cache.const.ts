interface templateCacheMember {
    template: string,
    styles: string
}

let _setTemplateAndStyle = (name: string): templateCacheMember => {
    let _path = `./component-base/${name}`;
    return {
        template: require(`${_path}/template.html`),
        styles: require(`${_path}/styles.css`)
    }
}

export const GDEIC_COMPONENT_TEMPLATE_CACHE = {
    'HOLD_ON': _setTemplateAndStyle('gdeic-hold-on')
}