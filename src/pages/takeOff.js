export function takeOff(elementSelector) {
    const element = document.querySelector(elementSelector);
    
    if(element)
    element.classList.add('dp-none')
    else
    alert('Please select')
}