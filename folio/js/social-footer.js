// console.log("✅ social-footer.js chargé !");
class SocialFooter extends HTMLElement {
  connectedCallback() {
    // Générer un ID unique pour éviter les conflits si plusieurs footers sur la page
    const uniqueId = "ig-grad-" + Math.random().toString(36).substr(2, 9);

    this.innerHTML = `
                    <style>
                        .social-footer {
          text-align: center;
          background-color: var(--card-bg);
          color: light-dark(var(--grey-700), var(--grey-300));
          padding: 1rem 1.5rem;
          border-top: 1px solid var(--border-color);
                        }

                        .footer-content {
                            max-width: 1200px;
                            margin: 0 auto;
                        }

                        .footer-title {
                            font-size: 1.2rem;
                            font-weight: 600;
                            margin-bottom: 1.5rem;
                            color: var(--accent-color, hsl(51, 100%, 42%));
                        }

                        .social-links {
                            display: flex;
                            justify-content: center;
                            gap: 1.5rem;
                            flex-wrap: wrap;
                            margin-bottom: 1rem;
                        }

                        .social-icon {
                            width: 24px;
                            height: 24px;
                            display: inline-block;
                            transition: transform 0.3s ease;
                        }

                        .social-icon:hover {
                            transform: translateY(-5px);
                        }

                        .social-icon svg {
                            width: 100%;
                            height: 100%;
                            fill: var(--accent-color, hsl(51, 100%, 42%));
                            transition: fill 0.3s ease;
                        }

                        .social-icon.discord:hover svg { fill: #5865F2; }
                        .social-icon.facebook:hover svg { fill: #1877F2; }
                        .social-icon.github:hover svg { fill: light-dark(#000000, #ffffff); }
                        .social-icon.instagram:hover svg { fill: url(#${uniqueId}); }
                        .social-icon.linkedin:hover svg { fill: #0A66C2; }
                        .social-icon.pinterest:hover svg { fill: #E60023; }
                        .social-icon.x:hover svg { fill: light-dark(#000000, #ffffff); }
                        .social-icon.youtube:hover svg { fill: #FF0000; }

                        .footer-text {
                            font-size: 0.9rem;
                            opacity: 0.9;
                        }
                    </style>

                    <svg xmlns="http://www.w3.org/2000/svg" style="position: absolute; width: 0; height: 0;">
                        <defs>
                            <linearGradient id="${uniqueId}" x1="0%" y1="100%" x2="100%" y2="0%">
                                <stop offset="0%" style="stop-color:#FFDC80;stop-opacity:1" />
                                <stop offset="25%" style="stop-color:#FCAF45;stop-opacity:1" />
                                <stop offset="50%" style="stop-color:#F77737;stop-opacity:1" />
                                <stop offset="75%" style="stop-color:#F56040;stop-opacity:1" />
                                <stop offset="100%" style="stop-color:#E1306C;stop-opacity:1" />
                            </linearGradient>

                            <symbol id="icon-discord" viewBox="0 0 24 24">
                                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                            </symbol>

                            <symbol id="icon-facebook" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669c1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </symbol>

                            <symbol id="icon-github" viewBox="0 0 24 24">
                                <path d="M12 .297c-6.63 0-12 5.373-12 12c0 5.303 3.438 9.8 8.205 11.385c.6.113.82-.258.82-.577c0-.285-.01-1.04-.015-2.04c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729c1.205.084 1.838 1.236 1.838 1.236c1.07 1.835 2.809 1.305 3.495.998c.108-.776.417-1.305.76-1.605c-2.665-.3-5.466-1.332-5.466-5.93c0-1.31.465-2.38 1.235-3.22c-.135-.303-.54-1.523.105-3.176c0 0 1.005-.322 3.3 1.23c.96-.267 1.98-.399 3-.405c1.02.006 2.04.138 3 .405c2.28-1.552 3.285-1.23 3.285-1.23c.645 1.653.24 2.873.12 3.176c.765.84 1.23 1.91 1.23 3.22c0 4.61-2.805 5.625-5.475 5.92c.42.36.81 1.096.81 2.22c0 1.606-.015 2.896-.015 3.286c0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                            </symbol>

                            <symbol id="icon-instagram" viewBox="0 0 24 24">
                                <path d="M12 0C8.74 0 8.333.015 7.053.072C5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053C.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913c.306.788.717 1.459 1.384 2.126c.667.666 1.336 1.079 2.126 1.384c.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558c.788-.306 1.459-.718 2.126-1.384c.666-.667 1.079-1.335 1.384-2.126c.296-.765.499-1.636.558-2.913c.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913c-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071c1.17.055 1.805.249 2.227.415c.562.217.96.477 1.382.896c.419.42.679.819.896 1.381c.164.422.36 1.057.413 2.227c.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227c-.224.562-.479.96-.899 1.382c-.419.419-.824.679-1.38.896c-.42.164-1.065.36-2.235.413c-1.274.057-1.649.07-4.859.07c-3.211 0-3.586-.015-4.859-.074c-1.171-.061-1.816-.256-2.236-.421c-.569-.224-.96-.479-1.379-.899c-.421-.419-.69-.824-.9-1.38c-.165-.42-.359-1.065-.42-2.235c-.045-1.26-.061-1.649-.061-4.844c0-3.196.016-3.586.061-4.861c.061-1.17.255-1.814.42-2.234c.21-.57.479-.96.9-1.381c.419-.419.81-.689 1.379-.898c.42-.166 1.051-.361 2.221-.421c1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162c0 3.405 2.76 6.162 6.162 6.162c3.405 0 6.162-2.76 6.162-6.162c0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4s4 1.79 4 4s-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44c-.795 0-1.44-.646-1.44-1.44c0-.794.646-1.439 1.44-1.439c.793-.001 1.44.645 1.44 1.439z"/>
                            </symbol>

                            <symbol id="icon-linkedin" viewBox="0 0 24 24">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037c-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85c3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065c0-1.138.92-2.063 2.063-2.063c1.14 0 2.064.925 2.064 2.063c0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </symbol>

                            <symbol id="icon-pinterest" viewBox="0 0 24 24">
                                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162c-.105-.949-.199-2.403.041-3.439c.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911c1.024 0 1.518.769 1.518 1.688c0 1.029-.653 2.567-.992 3.992c-.285 1.193.6 2.165 1.775 2.165c2.128 0 3.768-2.245 3.768-5.487c0-2.861-2.063-4.869-5.008-4.869c-3.41 0-5.409 2.562-5.409 5.199c0 1.033.394 2.143.889 2.741c.099.12.112.225.085.345c-.09.375-.293 1.199-.334 1.363c-.053.225-.172.271-.401.165c-1.495-.69-2.433-2.878-2.433-4.646c0-3.776 2.748-7.252 7.92-7.252c4.158 0 7.392 2.967 7.392 6.923c0 4.135-2.607 7.462-6.233 7.462c-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146c1.123.345 2.306.535 3.55.535c6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/>
                            </symbol>

                            <symbol id="icon-x" viewBox="0 0 24 24">
                                <path d="M18.244 2.25h3.308l-7.227 8.26l8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                            </symbol>

                            <symbol id="icon-youtube" viewBox="0 0 24 24">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                            </symbol>
                        </defs>
                    </svg>

                    <div class="social-footer">
                        <div class="footer-content">
                            <h2 class="footer-title">Suivez-nous</h2>

                            <div class="social-links">
                                <a href="#" class="social-icon discord" title="Discord" aria-label="Discord">
                                    <svg><use href="#icon-discord"></use></svg>
                                </a>
                                <a href="#" class="social-icon facebook" title="Facebook" aria-label="Facebook">
                                    <svg><use href="#icon-facebook"></use></svg>
                                </a>
                                <a href="#" class="social-icon github" title="Github" aria-label="Github">
                                    <svg><use href="#icon-github"></use></svg>
                                </a>
                                <a href="#" class="social-icon instagram" title="Instagram" aria-label="Instagram">
                                    <svg><use href="#icon-instagram"></use></svg>
                                </a>
                                <a href="#" class="social-icon linkedin" title="LinkedIn" aria-label="LinkedIn">
                                    <svg><use href="#icon-linkedin"></use></svg>
                                </a>
                                <a href="#" class="social-icon pinterest" title="Pinterest" aria-label="Pinterest">
                                    <svg><use href="#icon-pinterest"></use></svg>
                                </a>
                                <a href="#" class="social-icon x" title="X (Twitter)" aria-label="X">
                                    <svg><use href="#icon-x"></use></svg>
                                </a>
                                <a href="#" class="social-icon youtube" title="Youtube" aria-label="Youtube">
                                    <svg><use href="#icon-youtube"></use></svg>
                                </a>
                            </div>

                            <p class="footer-text">Le Wiwi © 2025 - Tous droits réservés</p>
                        </div>
                    </div>
                `;
  }
}

customElements.define("social-footer", SocialFooter);
