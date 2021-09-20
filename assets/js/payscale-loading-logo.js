class PayscaleLoadingLogo extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
        <style>
            .ps-loading-logo {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            }

            .ps-loading-logo__dots {
              align-content: flex-start;
              display: flex;
              flex-wrap: wrap;
              height: 14.8rem;
              margin-left: auto;
              margin-right: auto;
              width: 12.8rem;
            }

            .ps-loading-logo__dot {
              animation: ps-dot-fade 1.5s alternate ease-in-out infinite;
              background-color: #17064B;
              border-radius: 50%;
              height: 2rem;
              margin-bottom: 1.2rem;
              margin-right: 1.6rem;
              width: 2rem;
            }

            .ps-loading-logo__dot:nth-of-type(4n) {
              margin-right: 0;
            }

            .ps-loading-logo__dot:nth-of-type(1),
            .ps-loading-logo__dot:nth-of-type(2),
            .ps-loading-logo__dot:nth-of-type(3),
            .ps-loading-logo__dot:nth-of-type(5),
            .ps-loading-logo__dot:nth-of-type(6),
            .ps-loading-logo__dot:nth-of-type(7),
            .ps-loading-logo__dot:nth-of-type(10) {
              visibility: hidden;
            }

            .ps-loading-logo__dot:nth-of-type(4) {
              background-color: #FFB300;
            }

            .ps-loading-logo__dot:nth-of-type(9) {
              background-color: #2E0B96;
            }

            .ps-loading-logo__dot:nth-of-type(11) {
              background-color: #53D1DE;
            }

            .ps-loading-logo__dot:nth-of-type(14) {
              background-color: #3880EE;
            }

            .ps-loading-logo__dot:nth-of-type(n) {
              animation-delay: 1.3s;
            }

            .ps-loading-logo__dot:nth-of-type(n + 5) {
              animation-delay: 1s;
            }

            .ps-loading-logo__dot:nth-of-type(n + 9) {
              animation-delay: 0.7s;
            }

            .ps-loading-logo__dot:nth-of-type(n + 13) {
              animation-delay: 0.4s;
            }

            .ps-loading-logo__dot:nth-of-type(n + 17) {
              animation-delay: 0.2s;
              margin-bottom: 0;
            }


            @keyframes ps-dot-fade {
              100% {
                opacity: 0.2;
                transform: scale(0.5);
              }
            }

        </style>
        <div class="ps-loading-logo">
            <div class="ps-loading-logo__dots">
            <div class="ps-loading-logo__dot"></div>
            <div class="ps-loading-logo__dot"></div>
            <div class="ps-loading-logo__dot"></div>
            <div class="ps-loading-logo__dot"></div>
            <div class="ps-loading-logo__dot"></div>
            <div class="ps-loading-logo__dot"></div>
            <div class="ps-loading-logo__dot"></div>
            <div class="ps-loading-logo__dot"></div>
            <div class="ps-loading-logo__dot"></div>
            <div class="ps-loading-logo__dot"></div>
            <div class="ps-loading-logo__dot"></div>
            <div class="ps-loading-logo__dot"></div>
            <div class="ps-loading-logo__dot"></div>
            <div class="ps-loading-logo__dot"></div>
            <div class="ps-loading-logo__dot"></div>
            <div class="ps-loading-logo__dot"></div>
            <div class="ps-loading-logo__dot"></div>
            <div class="ps-loading-logo__dot"></div>
            <div class="ps-loading-logo__dot"></div>
            <div class="ps-loading-logo__dot"></div>
        </div>
    </div>`;
  }
}
window.customElements.define('payscale-loading-logo', PayscaleLoadingLogo);
