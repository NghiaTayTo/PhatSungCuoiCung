export function takeOn(elementSelector) {
    const element = document.querySelector(elementSelector);
    
    if(element)
    element.classList.remove('dp-none')
    else
    alert('Không tìm thấy elemet')
}