const observer = new MutationObserver(function (mutationsList, observer) {
  // 在每次变化发生时要执行的操作
  var elements = document.getElementsByClassName(' mu-drawer open');
  if (elements.length > 0) {
    elements = document.getElementsByClassName('layer_color');
    if (elements.length > 0) {
      for (let key = 0; key < elements.length; key++) {
        let container = elements[key];
        let themeElements = container.getElementsByClassName('el-theme');
        let themeElement = themeElements.length > 0 ? themeElements[0] : null;
        if (!themeElement) {
          themeElement = document.createElement('div');
          themeElement.className = 'el-theme';
          themeElement.style.color = '#7A7AF9';
          themeElement.style.fontWeight = 'bold';
          let index = 0;
          if (container.getElementsByClassName('subtitle color_title').length > 0) {
            index = 1;
          }
          container.insertBefore(themeElement, container.children[index]);
        }
        let colorElements = container.getElementsByClassName("color_li");
        if (colorElements.length > 0) {
          let colors = [];
          for (let i = 0; i < colorElements.length; i++) {
            let ele = colorElements[i];
            colors.push(getColor(ele));
          }
          if (colors.length == 1) {
            let color = colors[0];
            chrome.storage.sync.get(['colorData'], (result) => {
                let dataItem = result.colorData.find(item => item.color.toUpperCase() == color.toUpperCase())
                if(typeof dataItem == 'object') {
                  themeElement.style.display = 'block';
                  themeElement.textContent = dataItem.name;
                } else {
                  themeElement.style.display = 'none';
                  themeElement.textContent = ''
                }
            });
          }
          else {
            themeElement.style.display = 'none';
            themeElement.textContent = ''
          }
        }
      }
    }
  }
});

const rgb = (r, g, b) => {
  return `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`.toLocaleLowerCase();
}

const getColor = (element) => {
  let colors = element.getElementsByClassName('color');
  if (colors.length == 1) {
    let color = colors[0];
    let background = color.style.background;
    if (background) {
      background = background.replace(/\s/g, '');
      if (background.startsWith('rgb')) {
        let colorint = background.replace('rgb(', '').replace(')', '').split(',');
        return rgb(Number(colorint[0]), Number(colorint[1]), Number(colorint[2]));
      }
    }
  }
}

// 开始监测指定节点的变化
observer.observe(document.body, {
  childList: true, // 监测子节点的变化
  attributes: true, // 监测属性的变化
  subtree: true, // 包括所有后代节点
  attributeFilter: ['class', 'style'] // 过滤属性，只监测指定的属性变化
});