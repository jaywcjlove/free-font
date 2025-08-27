window.onload = function() {
  if (fontUrl) {
    let styleTag = document.getElementById('dynamic-style');
    if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = 'dynamic-style';
        document.head.appendChild(styleTag);
    }
    const fontFaceRule = `
        @font-face { font-family: 'PreviewFont'; src: url('${fontUrl}') format('truetype');}
        main, main pre {
            font-family: 'PreviewFont', sans-serif;
        }
    `;
    styleTag.innerHTML = fontFaceRule;
    // Define the font face
    const statusElement = document.getElementById('font-status');
    statusElement.textContent = `"${fontName}"正在加载中...`;
    const font = new FontFace('PreviewFont', `url(${fontUrl})`);
    document.fonts.ready.then((fontFaceSet) => {
        if (fontFaceSet.check('1em PreviewFont')) {
            statusElement.textContent = `"${fontName}"已加载`;
            statusElement.classList.add('done');
        } else {
            statusElement.textContent = `"${fontName}"尚未加载`;
        }
    });
    // Load the font
    font.load().then((loadedFont) => {
        document.fonts.add(loadedFont);
        statusElement.textContent = `"${fontName}"已加载`;
        statusElement.classList.add('done');
    }).catch((error) => {
        statusElement.classList.add('failed');
        console.error('Failed to load the custom font:', error);
        statusElement.textContent = `加载"${fontName}"失败`;
    });
  }
};