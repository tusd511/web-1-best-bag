function showLoading() {
  // https://codepen.io/danvim/pen/yLRVGMQ

  // Minified HTML for the spinner
  const spinnerHTML =
    '<div class="spinner-container"><div class="spinner"><div></div><div></div><div></div><div></div><div></div><div></div></div></div>';

  // Minified CSS for the spinner
  const spinnerCSS = `.spinner-container{margin: 0;display: flex;align-items: center;justify-content: center;height: 100vh;background-color: #1a65b3;color: #fff}.spinner{position: relative;width: 60px;height: 60px}.spinner div{position: absolute;top: 0;left: 0;right: 0;bottom: 0;opacity: 0;animation: r 5s infinite cubic-bezier(0.15, 0.55, 0.85, 0.45), o 5s infinite step-end}.spinner div::after{content: "";display: block;width: 5px;height: 5px;background-color: currentColor;border-radius: 100%;translate: 0 27.5px}.spinner div:nth-child(1){animation-delay: 0s}.spinner div:nth-child(2){animation-delay: 0.2s}.spinner div:nth-child(3){animation-delay: 0.4s}.spinner div:nth-child(4){animation-delay: 0.6s}.spinner div:nth-child(5){animation-delay: 0.8s}.spinner div:nth-child(6){animation-delay: 1s}@keyframes r{0%{transform: rotate(-90deg)}35%{transform: rotate(270deg)}70%{transform: rotate(630deg)}100%{transform: rotate(630deg)}}@keyframes o{0%{opacity: 1}70%{opacity: 0}}`;

  // Inject CSS
  const styleElement = document.createElement("style");
  styleElement.innerHTML = spinnerCSS;
  document.head.appendChild(styleElement);

  // Inject HTML
  const spinnerContainer = document.createElement("div");
  spinnerContainer.innerHTML = spinnerHTML;
  document.body.prepend(spinnerContainer);
  window.scrollTo(0, 0);

  return [spinnerContainer, styleElement];
}

function removeLoading([spinnerContainer, styleElement]) {
  if (spinnerContainer) {
    document.body.removeChild(spinnerContainer);
  }

  if (styleElement) {
    document.head.removeChild(styleElement);
  }
}

// goi khi trang web load thanh cong
window.addEventListener("load", () => {
  // Example usage
  const [spinnerContainer, styleElement] = showLoading();
  setTimeout(removeLoading, 5000, [spinnerContainer, styleElement]); // Remove loading spinner after 5 seconds
});
