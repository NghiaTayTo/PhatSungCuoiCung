export function countUp(elementId, start, end, duration) {
    let startTime = null;

    const step = (timestamp) => {
        const element = document.getElementById(elementId);
        if (!element) {
            console.warn(`Element with ID ${elementId} not found`);
            return;  // Nếu phần tử không tồn tại, dừng hàm
        }

        if (!startTime) startTime = timestamp;
        const progress = timestamp - startTime;
        const current = Math.min(Math.floor((progress / duration) * (end - start) + start), end);
        // Sử dụng toLocaleString() để định dạng số
        element.innerText = current.toLocaleString();

        if (current < end) {
            window.requestAnimationFrame(step);
        }
    };

    window.requestAnimationFrame(step);
}
