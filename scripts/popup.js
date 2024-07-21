let containerEl = document.getElementById('container');
let addBtn = document.getElementById('addBtn');
let clearBtn = document.getElementById('clearBtn');
let submitBtn = document.getElementById('submitBtn');

addBtn.addEventListener('click', addElement)
clearBtn.addEventListener('click', () => {
    chrome.storage.sync.remove('colorData');
    let inputDivArr = [...document.getElementsByClassName('input-box')];
    inputDivArr.forEach(inputDivEl => {
        let inputArr = inputDivEl.querySelectorAll('input')
        inputArr[0].value = ''
        inputArr[1].value = ''
    })
})

function addElement() {
    let newDiv = document.createElement('div')
    let newColorInput = document.createElement('input')
    let newNameInput = document.createElement('input')
    newDiv.setAttribute('class', 'input-box')
    newColorInput.setAttribute('placeholder', '请输入色值')
    newNameInput.setAttribute('placeholder', '请输入主题色名称')
    newDiv.appendChild(newColorInput)
    newDiv.appendChild(newNameInput)
    containerEl.appendChild(newDiv)
}

submitBtn.addEventListener('click', () => {
    let inputDivArr = [...document.getElementsByClassName('input-box')];
    let data = inputDivArr.map(inputDivEl => {
        let inputArr = inputDivEl.querySelectorAll('input')
        return {
            name: inputArr[1].value,
            color: inputArr[0].value,
        }
    }).filter(item => item.color !== '' || item.name !== '');
    chrome.storage.sync.set({colorData: data}, function() {
        window.close();
    });
})

document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.sync.get(['colorData'], (result) => {
        if(result.colorData && Array.isArray(result.colorData)) {
            result.colorData.forEach(item => {
                let newDiv = document.createElement('div')
                let newColorInput = document.createElement('input')
                let newNameInput = document.createElement('input')
                newDiv.setAttribute('class', 'input-box')
                newColorInput.setAttribute('placeholder', '请输入色值')
                newColorInput.setAttribute('value', item.color)
                newNameInput.setAttribute('placeholder', '请输入主题色名称')
                newNameInput.setAttribute('value', item.name)
                newDiv.appendChild(newColorInput)
                newDiv.appendChild(newNameInput)
                containerEl.appendChild(newDiv)
            });
            for(let i = 0; i < 5 - result.colorData.length; i++) {
                addElement()
            }
        } else {
            for(let i = 0; i < 5; i++) {
                addElement()
            }
        }
    });
})